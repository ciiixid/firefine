const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function getDatabase() {
    return open({
        filename: path.join(__dirname, '../../storage/database.sqlite'),
        driver: sqlite3.Database
    });
}

async function initDatabase() {
    const db = await getDatabase();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            visitor_token TEXT NOT NULL,
            sender TEXT NOT NULL, -- 'user' atau 'admin'
            message TEXT NOT NULL,
            telegram_message_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('The SQLite database has been successfully initialized.');
}

module.exports = { getDatabase, initDatabase };