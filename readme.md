# 🔥 Firefine 
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)  [![Telegram Bot API](https://img.shields.io/badge/Telegram-2CA5E0?style=flat-square&logo=telegram&logoColor=white)](https://core.telegram.org/bots/api)

Firefine is a self-hosted, anonymous Telegram-based live chat system built with Node.js, Express, and SQLite. It routes web visitor messages directly to a Telegram bot, allowing administrators to reply instantly from Telegram, with replies synced back to the web visitor in real-time.

---

## ✨ Key Features

- **Self-Hosted & Lightweight**: Powered by Express.js and an embedded SQLite database (`storage/database.sqlite`).
- **Telegram Bot Integration**: Seamlessly maps visitor chat sessions and routes admin replies using native Telegram message replies.
- **Domain Whitelisting Security**: Protects your widget from unauthorized embedding on third-party websites by validating the request origin against server-side environment configurations.
- **Apple-Inspired Liquid Glass UI**: Clean, modern, and minimalist design for both full-page chat and floating widgets.
- **Laravel-Like Error Logging**: Centralized error middleware logging exceptions to `storage/logs/error.log`.

---

## 🛠️ Project Structure

```text
firefine/
├── src/
│   ├── app.js                 # Application entry point & server setup
│   ├── bot/
│   │   ├── telegram.bot.js    # Telegram bot initialization (Telegraf)
│   │   └── bot.handlers.js    # Message routing & ID mapping logic
│   ├── config/
│   │   ├── database.sqlite    # SQLite database storage
│   │   ├── database.js        # SQLite connection setup
│   │   └── logger.js          # Error logger utility
│   ├── controllers/
│   │   └── form.controller.js # API business logic
│   ├── middlewares/
│   │   ├── domain.middleware.js # Domain security filter
│   │   └── error.middleware.js  # Global error handler
│   ├── routes/
│   │   └── api.routes.js      # API endpoints routing
│   └── public/
│       ├── chat-page.html     # Full-page modern chat interface
│       └── widget.js          # Floating support widget script
├── storage/
│   └── logs/
│       └── error.log          # System error logs
├── .env                       # Environment configuration
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/firefine.git
   cd firefine
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory based on the following template:
   ```env
   PORT=3000
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   ALLOWED_DOMAINS=localhost:3000,yourdomain.com
   ```

4. **Run the Application:**
   - For Development:
     ```bash
     npm run start
     ```
   - For Production (using PM2):
     ```bash
     pm2 start src/app.js --name "firefine"
     ```

---

## 🔒 Security Measures

Firefine enforces strict domain whitelisting. The `/widget.js` script route validates the incoming `Referer` or `Origin` header against `ALLOWED_DOMAINS` defined in your `.env` file. Unauthorized websites attempting to embed the widget receive an immediate `403 Forbidden` response, preventing unauthorized usage and spam.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).