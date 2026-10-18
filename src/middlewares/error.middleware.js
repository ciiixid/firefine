/**
 * Global Error Handling Middleware
 * Captures unhandled errors, writes them to error.log via Winston,
 * and returns a clean JSON response to the client.
 */

const logger = require('../config/logger');

const errorMiddleware = (err, req, res, next) => {
    // Log detailed error stack trace to storage/logs/error.log
    logger.error(`${err.message} - ${req.method} ${req.originalUrl} - Stack: ${err.stack}`);

    // Determine status code (default to 500 if not set)
    const statusCode = err.statusCode || 500;

    // Send safe response to the client
    res.status(statusCode).json({
        success: false,
        message: err.message || 'An internal server error occurred. Please try again later.'
    });
};

module.exports = errorMiddleware;