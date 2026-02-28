const { ActivityType } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'clientReady',
    once: true,
    execute(client) {
        console.log(`[BOT] ✅ ${client.user.tag} is online and ready!`);
        console.log(`[BOT] Serving ${client.guilds.cache.size} guild(s)`);
        client.user.setPresence({
            activities: [{ name: config.botActivity, type: ActivityType.Listening }],
            status: 'online',
        });
    },
};
