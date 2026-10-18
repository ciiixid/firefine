/**
 * Chat Model
 * Handles database operations and queries related to chat sessions and messages.
 */

const { getDatabase } = require('../config/database');

class ChatModel {
    /**
     * Save a new message (from user or admin) to the database.
     * @param {string} visitorToken - Unique visitor session identifier
     * @param {string} sender - Sender type ('user' or 'admin')
     * @param {string} message - Message text content
     * @returns {Promise<number>} - Returns the inserted record ID
     */
    static async createMessage(visitorToken, sender, message) {
        const db = await getDatabase();
        const result = await db.run(
            `INSERT INTO chats (visitor_token, sender, message) VALUES (?, ?, ?)`,
            [visitorToken, sender, message]
        );
        return result.lastID;
    }

    /**
     * Update the Telegram message ID for routing responses.
     * @param {number} id - Internal database record ID
     * @param {number} telegramMessageId - Message ID from Telegram API
     */
    static async updateTelegramMessageId(id, telegramMessageId) {
        const db = await getDatabase();
        await db.run(
            `UPDATE chats SET telegram_message_id = ? WHERE id = ?`,
            [telegramMessageId, id]
        );
    }

    /**
     * Find a chat session by Telegram message ID (used when admin replies).
     * @param {number} telegramMessageId - Telegram message ID being replied to
     * @returns {Promise<Object|undefined>} - Returns the chat record if found
     */
    static async findByTelegramMessageId(telegramMessageId) {
        const db = await getDatabase();
        return await db.get(
            `SELECT visitor_token FROM chats WHERE telegram_message_id = ?`,
            [telegramMessageId]
        );
    }

    /**
     * Get all message histories for a specific visitor token.
     * @param {string} visitorToken - Unique visitor session identifier
     * @returns {Promise<Array>} - List of messages
     */
    static async getMessagesByToken(visitorToken) {
        const db = await getDatabase();
        return await db.all(
            `SELECT sender, message, created_at FROM chats WHERE visitor_token = ? ORDER BY created_at ASC`,
            [visitorToken]
        );
    }
}

module.exports = ChatModel;