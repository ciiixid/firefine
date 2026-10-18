const { Telegraf } = require('telegraf');
const logger = require('../config/logger');

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
    logger.error('BOT_TOKEN has not been set in the .env file');
}

const bot = new Telegraf(botToken);

module.exports = bot;