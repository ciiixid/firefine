const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
    level: 'error',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
    ),
    transports: [
        new transports.File({ filename: path.join(__dirname, '../../storage/logs/error.log'), level: 'error' }),
        new transports.Console()
    ]
});

module.exports = logger;