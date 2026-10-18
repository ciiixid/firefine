/**
 * Domain Whitelist Security Middleware
 * Restricts API access so that widgets embedded on unauthorized websites 
 * cannot spam messages to the Telegram bot.
 */

const logger = require('../config/logger');

const domainSecurityMiddleware = (req, res, next) => {
    const allowedDomainsEnv = process.env.ALLOWED_DOMAINS;

    // If ALLOWED_DOMAINS is not set or empty, allow all requests (fallback for ease of setup)
    if (!allowedDomainsEnv) {
        return next();
    }

    const allowedDomains = allowedDomainsEnv.split(',').map(domain => domain.trim());
    
    // Get origin or referer from request headers
    const origin = req.headers.origin || req.headers.referer;

    // If no origin/referer header (e.g., accessed directly via Postman or server-to-server), 
    // you can decide whether to allow or block. For public widgets, browser requests always send origin/referer.
    if (!origin) {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Missing origin header.'
        });
    }

    // Check if origin matches any allowed domain
    const isAllowed = allowedDomains.some(domain => origin.includes(domain));

    if (!isAllowed) {
        logger.warn(`Blocked unauthorized widget request from origin: ${origin}`);
        return res.status(403).json({
            success: false,
            message: 'Access denied: Unauthorized domain.'
        });
    }

    next();
};

module.exports = domainSecurityMiddleware;