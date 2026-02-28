const { EmbedBuilder } = require('discord.js');
const config = require('../../config');

// DisTube v5 error event signature: (error, queue)
module.exports = {
    name: 'error',
    execute(error, queue, client) {
        console.error('[DISTUBE ERROR]', error);
        const embed = new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Music Error')
            .setDescription(`\`\`\`${error?.message?.slice(0, 1000) ?? String(error).slice(0, 1000)}\`\`\``);
        queue?.textChannel?.send({ embeds: [embed] }).catch(() => { });
    },
};
