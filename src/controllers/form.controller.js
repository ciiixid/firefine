const { getDatabase } = require('../config/database');
const axios = require('axios'); // Kita butuh axios untuk HTTP request ke Telegram API

const submitMessage = async (req, res, next) => {
    try {
        const { visitor_token, message } = req.body;

        if (!visitor_token || !message) {
            return res.status(400).json({
                success: false,
                message: 'The visitor token and message fields are mandatory.'
            });
        }

        const db = await getDatabase();

        const result = await db.run(
            `INSERT INTO chats (visitor_token, sender, message) VALUES (?, ?, ?)`,
            [visitor_token, 'user', message]
        );
        const chatId = result.lastID;

        const botToken = process.env.BOT_TOKEN;
        const adminChatId = process.env.ADMIN_CHAT_ID;

        if (!botToken || !adminChatId) {
            throw new Error('The BOT_TOKEN or ADMIN_CHAT_ID configuration has not been set in .env');
        }

        const telegramText = `💬 *A new message from Web*\n\n` +
                             `👤 *Visitor Token:* \`${visitor_token}\`\n` +
                             `📝 *Message:* ${message}`;

        const telegramResponse = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: adminChatId,
            text: telegramText,
            parse_mode: 'Markdown'
        });

        const telegramMessageId = telegramResponse.data.result.message_id;

        await db.run(
            `UPDATE chats SET telegram_message_id = ? WHERE id = ?`,
            [telegramMessageId, chatId]
        );

        return res.status(200).json({
            success: true,
            message: 'Message successfully sent to the admin.'
        });

    } catch (error) {
        next(error);
    }
};

const getMessages = async (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ success: false, message: 'Token tidak valid.' });
        }

        const db = await getDatabase();
        const messages = await db.all(
            `SELECT sender, message, created_at FROM chats WHERE visitor_token = ? ORDER BY created_at ASC`,
            [token]
        );

        return res.status(200).json({
            success: true,
            data: messages
        });

    } catch (error) {
        next(error);
    }
};

const checkDomainAuthorization = async (req, res, next) => {
    try {
        const referer = req.headers.referer || req.headers.origin;
        const allowedDomainsEnv = process.env.ALLOWED_DOMAINS;

        if (!allowedDomainsEnv) {
            return res.status(200).json({ allowed: true });
        }

        if (!referer) {
            return res.status(200).json({ allowed: false });
        }

        const allowedDomains = allowedDomainsEnv.split(',').map(d => d.trim());
        const isAllowed = allowedDomains.some(domain => referer.includes(domain));

        return res.status(200).json({ allowed: isAllowed });
    } catch (error) {
        next(error);
    }
};

module.exports = { submitMessage, getMessages, checkDomainAuthorization };