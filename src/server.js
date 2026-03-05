const express = require('express');
const cron = require('node-cron');
const fetch = require('node-fetch');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        bot: 'MixMusicDC',
        message: '🎵 MixMusicDC is alive!',
        timestamp: new Date().toISOString(),
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

function startServer() {
    const server = app.listen(PORT, () => {
        console.log(`[SERVER] Keep-alive server running on port ${PORT}`);
        scheduleKeepAlive();
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`[SERVER] Port ${PORT} is already in use. Kill the other process and restart.`);
            console.error(`[SERVER] Run: npx kill-port ${PORT}`);
        } else {
            console.error('[SERVER] Unexpected error:', err);
        }
        process.exit(1);
    });
}

function scheduleKeepAlive() {
    const renderUrl = process.env.RENDER_URL;
    if (!renderUrl || renderUrl === 'http://localhost:3000') return;

    cron.schedule('*/14 * * * *', async () => {
        try {
            const res = await fetch(`${renderUrl}/health`);
            console.log(`[KEEP-ALIVE] Pinged → ${res.status}`);
        } catch (err) {
            console.error('[KEEP-ALIVE] Ping failed:', err.message);
        }
    });

    console.log('[SERVER] Keep-alive self-ping scheduled every 14 minutes.');
}

module.exports = { startServer };
