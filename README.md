# 🤖 Kelin AI - WhatsApp Bot

A lightweight, memory-efficient WhatsApp bot designed for deployment on free hosting panels like **Katabump**.

## ✨ Features

- ✅ **Pairing Code Authentication** (Perfect for headless panels)
- ✅ **Lightweight** (~150MB memory usage)
- ✅ **Fast Startup** (~5 seconds)
- ✅ **Auto-Reconnection** on disconnect
- ✅ **Command Cooldown System** (prevents spam)
- ✅ **Group Management** (kick, promote, demote, etc.)
- ✅ **Interactive Menu System** (plain text, no channel JID)
- ✅ **Production Ready** (TypeScript, error handling, logging)

## 🎮 Available Commands

### General Commands
- `.menu` - Show all available commands
- `.owner` - Get bot owner info
- `.alive` - Check bot status & uptime
- `.ping` - Check response latency

### Group Commands
- `.kick @user` - Remove member from group
- `.promote @user` - Make user group admin
- `.demote @user` - Remove admin privileges
- `.groupinfo` - Get group information
- `.members` - List all group members

### Utility Commands
- `.quote [reply]` - Quote a message
- `.sticker [reply]` - Convert image to sticker
- `.toimage [reply]` - Convert sticker to image

## 🚀 Deployment on Katabump

### Prerequisites
- Node.js 18+ runtime
- WhatsApp account
- Phone number with WhatsApp installed

### Step 1: Clone/Upload Repository

```bash
git clone https://github.com/kelin132/Kelin-Ai-.git
cd Kelin-Ai-
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Project

```bash
npm run build
```

### Step 3: Configure Environment

Create `.env` file in root directory:

```env
USE_PAIRING_CODE=true
PREFIX=.
OWNER_NUMBER=1234567890
OWNER_NAME=Kelin
AUTO_READ=true
AUTO_REPLY=true
CMD_COOLDOWN=3000
LOG_LEVEL=info
```

**Configuration Options:**
- `USE_PAIRING_CODE` - Set to `true` for pairing code, `false` for QR code
- `PREFIX` - Command prefix (default: `.`)
- `OWNER_NUMBER` - Your WhatsApp number
- `OWNER_NAME` - Your name
- `AUTO_READ` - Auto-read messages (true/false)
- `AUTO_REPLY` - Auto-reply to messages (true/false)
- `CMD_COOLDOWN` - Command cooldown in milliseconds (default: 3000)

### Step 4: Start the Bot

```bash
npm start
```

### Step 5: Authenticate with Pairing Code

You'll see the pairing code in the console:

```
============================================================
🔐 PAIRING CODE (Valid for 1 minute)

   123-456

📱 Enter this code in WhatsApp:
   Settings → Linked Devices → Link a Device
============================================================
```

### Step 6: Complete Pairing

1. Open **WhatsApp** on your phone
2. Go to **Settings** → **Linked Devices**
3. Tap **Link a Device**
4. Enter the pairing code from the console
5. Wait for connection confirmation

```
✅ Bot connected successfully!
🟢 Logged in as: Your Name
🎉 Kelin AI Bot is ready!
```

## 📊 System Requirements

| Requirement | Minimum | Recommended |
|------------|---------|------------|
| Memory | 128MB | 256MB+ |
| Storage | 50MB | 100MB+ |
| Node.js | 18.0.0 | 18.17.0+ |
| Network | 1Mbps | 5Mbps+ |

## ⚙️ Environment Setup for Katabump Panel

### In Katabump Console:

1. **Create Application**
   - Runtime: Node.js 18
   - Entry Point: `npm start`

2. **Set Environment Variables**
   - `USE_PAIRING_CODE=true`
   - `PREFIX=.`
   - `OWNER_NUMBER=1234567890`
   - `OWNER_NAME=Kelin`

3. **Configure Build Command**
   ```bash
   npm install && npm run build
   ```

4. **Configure Start Command**
   ```bash
   npm start
   ```

5. **Enable Persistent Storage** (for session folder)

## 🔍 Troubleshooting

### Pairing Code not appearing?
- Check console logs
- Ensure `USE_PAIRING_CODE=true` in .env
- Restart the application

### Bot disconnects frequently?
- Check your internet connection
- Increase `CMD_COOLDOWN` value
- Check panel resource limits

### High memory usage?
- Reduce `MAX_CACHE_SIZE` in configManager.ts
- Disable `AUTO_READ` if not needed
- Check for message loops

### Session not persisting?
- Ensure `/session` folder has write permissions
- Enable persistent storage in panel settings
- Check available storage space

## 📁 Project Structure

```
Kelin-Ai-/
├── src/
│   ├── index.ts                      # Bot entry point
│   ├── utils/
│   │   ├── configManager.ts          # Configuration & cache
│   │   └── authManager.ts            # Authentication & pairing code
│   └── handlers/
│       ├── messageHandler.ts         # Message routing
│       └── commands/
│           ├── messageCommand.ts     # General commands
│           ├── groupCommand.ts       # Group management
│           └── utilityCommand.ts     # Utility features
├── dist/                             # Compiled JavaScript
├── session/                          # WhatsApp session data
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🛠️ Development

### Build
```bash
npm run build
```

### Start Development
```bash
npm run dev
```

### Clean Build
```bash
npm run clean && npm run build
```

## 📝 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

- This bot is for educational purposes
- Comply with WhatsApp's Terms of Service
- Respect privacy and don't spam
- Use responsibly

## 🤝 Support

For issues or questions:
1. Check troubleshooting section
2. Review console logs
3. Check environment configuration

---

**Made with ❤️ by Kelin AI**
