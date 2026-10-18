require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { initDatabase } = require('./config/database');
const { setupBotHandlers } = require('./bot/bot.handlers');
const apiRoutes = require('./routes/api.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/widget.js', (req, res) => {
    const referer = req.headers.referer || req.headers.origin;
    
    const allowedDomainsEnv = process.env.ALLOWED_DOMAINS;

    if (allowedDomainsEnv && referer) {
        const allowedDomains = allowedDomainsEnv.split(',').map(d => d.trim());
        const isAllowed = allowedDomains.some(domain => referer.includes(domain));

        if (!isAllowed) {
            console.warn(`[BLOCKED] Unauthorized widget request from: ${referer}`);
            return res.status(403).send('// Widget access denied for this domain.');
        }
    }

    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'public', 'widget.js'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRoutes);

app.use(errorMiddleware);

async function startServer() {
    try {
        await initDatabase();

        setupBotHandlers();

        app.listen(PORT, () => {
            const cyan = '\x1b[36m';
            const green = '\x1b[32m';
            const dim = '\x1b[2m';
            const reset = '\x1b[0m';
            const bold = '\x1b[1m';

            function _0x2cbd(){var _0x517770=['617712eeZceo','18uEXzmz','10821CgjeUD','443002NwGFBZ','🔗\x20Local\x20URL\x20:\x20','1788TLQYXH','\x0a\x20_____\x20___\x20____\x20\x20_____\x20_____\x20___\x20_\x20\x20\x20_\x20_____\x20\x0a|\x20\x20___|_\x20_|\x20\x20_\x20\x5c|\x20____|\x20\x20___|_\x20_|\x20\x5c\x20|\x20|\x20____|\x0a|\x20|_\x20\x20\x20|\x20||\x20|_)\x20|\x20\x20_|\x20|\x20|_\x20\x20\x20|\x20||\x20\x20\x5c|\x20|\x20\x20_|\x20\x20\x0a|\x20\x20_|\x20\x20|\x20||\x20\x20_\x20<|\x20|___|\x20\x20_|\x20\x20|\x20||\x20|\x5c\x20\x20|\x20|___\x20\x0a|_|\x20\x20\x20|___|_|\x20\x5c_\x5c_____|_|\x20\x20\x20|___|_|\x20\x5c_|_____|','56969otmlij','48hAZXFI','1604660heRkti','http://localhost:','3087444FhOBLv','log','🚀\x20FIREFINE\x20Server','\x20is\x20running\x20successfully!','--------------------------------------------------','2709548uzfVxh','🛡️\x20\x20Security\x20\x20:\x20Domain\x20Whitelisting\x20Active','92xDFcKN','5dauTJu'];_0x2cbd=function(){return _0x517770;};return _0x2cbd();}var _0x392ffa=_0x3130;function _0x3130(_0x39af1,_0x443151){_0x39af1=_0x39af1-0x1ec;var _0x2cbd78=_0x2cbd();var _0x3130d8=_0x2cbd78[_0x39af1];return _0x3130d8;}(function(_0x15854c,_0x4b77c8){var _0x31f694=_0x3130,_0x15fd00=_0x15854c();while(!![]){try{var _0x42ecca=-parseInt(_0x31f694(0x1ee))/0x1*(-parseInt(_0x31f694(0x1fe))/0x2)+parseInt(_0x31f694(0x1ec))/0x3+-parseInt(_0x31f694(0x1fc))/0x4*(parseInt(_0x31f694(0x1ff))/0x5)+-parseInt(_0x31f694(0x1f7))/0x6+-parseInt(_0x31f694(0x1ef))/0x7*(-parseInt(_0x31f694(0x1f4))/0x8)+parseInt(_0x31f694(0x1ed))/0x9*(-parseInt(_0x31f694(0x1f5))/0xa)+parseInt(_0x31f694(0x1f3))/0xb*(parseInt(_0x31f694(0x1f1))/0xc);if(_0x42ecca===_0x4b77c8)break;else _0x15fd00['push'](_0x15fd00['shift']());}catch(_0x43a3f9){_0x15fd00['push'](_0x15fd00['shift']());}}}(_0x2cbd,0x53894),console[_0x392ffa(0x1f8)](cyan+bold+_0x392ffa(0x1f2)+reset),console[_0x392ffa(0x1f8)](dim+_0x392ffa(0x1fb)+reset),console[_0x392ffa(0x1f8)](green+_0x392ffa(0x1f9)+reset+_0x392ffa(0x1fa)),console[_0x392ffa(0x1f8)](_0x392ffa(0x1f0)+cyan+_0x392ffa(0x1f6)+PORT+reset),console[_0x392ffa(0x1f8)](_0x392ffa(0x1fd)),console[_0x392ffa(0x1f8)](dim+_0x392ffa(0x1fb)+reset));
        });

    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer();