const bot = require('./telegram.bot');
const { getDatabase } = require('../config/database');
const logger = require('../config/logger');

function setupBotHandlers() {
    bot.on('message', async (ctx) => {
        try {
            const repliedMessage = ctx.message.reply_to_message;
            
            if (!repliedMessage) {
                return;
            }

            const originalTelegramMsgId = repliedMessage.message_id;
            const adminReplyText = ctx.message.text;

            if (!adminReplyText) return;

            const db = await getDatabase();

            const chatSession = await db.get(
                `SELECT visitor_token FROM chats WHERE telegram_message_id = ?`,
                [originalTelegramMsgId]
            );

            if (!chatSession) {
                await ctx.reply('⚠️ Failed to find a chat session for this message in the database.');
                return;
            }

            await db.run(
                `INSERT INTO chats (visitor_token, sender, message) VALUES (?, ?, ?)`,
                [chatSession.visitor_token, 'admin', adminReplyText]
            );

            await ctx.reply('✅ Reply sent to user on the web!', {
                reply_to_message_id: ctx.message.message_id
            });

        } catch (error) {
            logger.error(`Error di bot handler: ${error.message} - Stack: ${error.stack}`);
            await ctx.reply('❌ An error occurred while processing the reply.');
        }
    });

    bot.launch()
        .then(() => console.log('🤖 Telegram bot is running successfully (Long Polling)!'))
        .catch((err) => logger.error(`Failed to launch Telegram bot: ${err.message}`));

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

module.exports = { setupBotHandlers };