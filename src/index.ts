import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  proto
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { logger, appConfig } from './utils/configManager';
import { MessageHandler } from './handlers/messageHandler';
import path from 'path';
import fs from 'fs';

class KelinAIBot {
  private socket: WASocket | null = null;
  private messageHandler: MessageHandler;
  private sessionPath: string;

  constructor() {
    this.messageHandler = new MessageHandler();
    this.sessionPath = path.join(process.cwd(), 'session');

    // Create session directory if it doesn't exist
    if (!fs.existsSync(this.sessionPath)) {
      fs.mkdirSync(this.sessionPath, { recursive: true });
    }
  }

  async start(): Promise<void> {
    try {
      logger.info('🤖 Starting Kelin AI Bot...');
      logger.info(`📍 Configuration: Prefix=${appConfig.prefix}, Owner=${appConfig.ownerName}`);

      const { state, saveCreds } = await useMultiFileAuthState(this.sessionPath);

      this.socket = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: logger,
        browser: ['Kelin AI', 'Safari', '1.0.0'],
        // Memory optimizations
        syncFullHistory: false,
        shouldSyncHistoryMessage: () => false,
        generateHighQualityLinkPreview: false,
        retryRequestDelayMs: 10,
        maxMsgsInMemory: 50,
        markOnlineThrottle: 30000,
        emitOwnEventsUnencrypted: true
      });

      // Handle credentials update
      this.socket.ev.on('creds.update', saveCreds);

      // Handle connection updates
      this.socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          logger.info('📱 Scan QR code to login');
        }

        if (connection === 'connecting') {
          logger.info('🔄 Connecting to WhatsApp...');
        }

        if (connection === 'open') {
          logger.info('✅ Bot connected successfully!');
          logger.info(`🟢 Logged in as: ${this.socket?.user?.name}`);
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

          if (shouldReconnect) {
            logger.warn('⚠️ Connection lost. Reconnecting...');
            setTimeout(() => this.start(), 5000);
          } else {
            logger.error('❌ Device logged out. Please login again.');
            if (fs.existsSync(this.sessionPath)) {
              fs.rmSync(this.sessionPath, { recursive: true });
            }
          }
        }
      });

      // Handle messages
      this.socket.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];

        if (!message.key.fromMe && message.message) {
          try {
            await this.messageHandler.handle(message, this.socket);
          } catch (error) {
            logger.error('Error in message handler:', error);
          }
        }
      });

      // Handle group updates
      this.socket.ev.on('groups.update', (groupUpdates) => {
        for (const groupUpdate of groupUpdates) {
          if (groupUpdate.announce === true) {
            logger.info(`📢 Group ${groupUpdate.id} is now announcement only`);
          } else if (groupUpdate.announce === false) {
            logger.info(`📢 Group ${groupUpdate.id} is now open to all`);
          }

          if (groupUpdate.restrict === true) {
            logger.info(`🔒 Group ${groupUpdate.id} is now restricted (only admins can edit)`);
          } else if (groupUpdate.restrict === false) {
            logger.info(`🔓 Group ${groupUpdate.id} is now unrestricted`);
          }
        }
      });

      logger.info('🎉 Kelin AI Bot is ready!');
    } catch (error) {
      logger.error('Failed to start bot:', error);
      process.exit(1);
    }
  }
}

// Start bot
const bot = new KelinAIBot();
bot.start().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('👋 Shutting down gracefully...');
  process.exit(0);
});
