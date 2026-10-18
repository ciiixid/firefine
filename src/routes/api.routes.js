const express = require('express');
const router = express.Router();
const { submitMessage, getMessages, checkDomainAuthorization } = require('../controllers/form.controller');
const domainSecurityMiddleware = require('../middlewares/domain.middleware');

router.post('/submit', domainSecurityMiddleware, submitMessage);
router.get('/messages/:token', domainSecurityMiddleware, getMessages);
router.get('/check-domain', checkDomainAuthorization);

module.exports = router;