import { useMultiFileAuthState } from '@whiskeysockets/baileys';
import path from 'path';
import fs from 'fs';
import readline from 'readline';
import { logger } from './configManager';

export class AuthManager {
  private sessionPath: string;
  private rl: readline.Interface;

  constructor() {
    this.sessionPath = path.join(process.cwd(), 'session');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Create session directory if it doesn't exist
    if (!fs.existsSync(this.sessionPath)) {
      fs.mkdirSync(this.sessionPath, { recursive: true });
    }
  }

  /**
   * Get auth state for multi-file authentication
   */
  async getAuthState() {
    return await useMultiFileAuthState(this.sessionPath);
  }

  /**
   * Check if already authenticated
   */
  isAuthenticated(): boolean {
    const credPath = path.join(this.sessionPath, 'creds.json');
    return fs.existsSync(credPath);
  }

  /**
   * Get pairing code (phone number required)
   */
  async getPairingCode(): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(
        '📱 Enter your WhatsApp phone number (with country code, e.g., 1234567890): ',
        (answer) => {
          resolve(answer.replace(/\D/g, ''));
        }
      );
    });
  }

  /**
   * Display pairing code to user
   */
  displayPairingCode(code: string): void {
    logger.info('');
    logger.info('═'.repeat(60));
    logger.info('🔐 PAIRING CODE (Valid for 15 minutes)');
    logger.info('═'.repeat(60));
    logger.info(`\n   ${code}\n`);
    logger.info('📱 Enter this code in WhatsApp > Settings > Linked Devices');
    logger.info('═'.repeat(60));
    logger.info('');
  }

  /**
   * Clear session (logout)
   */
  clearSession(): void {
    if (fs.existsSync(this.sessionPath)) {
      fs.rmSync(this.sessionPath, { recursive: true, force: true });
      logger.info('✅ Session cleared. Please restart the bot.');
    }
  }

  /**
   * Get session info
   */
  getSessionInfo(): {
    authenticated: boolean;
    sessionPath: string;
    credentialsExist: boolean;
  } {
    return {
      authenticated: this.isAuthenticated(),
      sessionPath: this.sessionPath,
      credentialsExist: fs.existsSync(path.join(this.sessionPath, 'creds.json')),
    };
  }

  close(): void {
    this.rl.close();
  }
}

export default new AuthManager();
