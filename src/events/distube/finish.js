const { EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: 'finish',
    execute(queue, client) {
        const embed = new EmbedBuilder()
            .setColor(config.colors.info)
            .setDescription('✅ Queue finished! Add more songs with `/play`.');
        queue.textChannel?.send({ embeds: [embed] }).catch(() => { });
    },
};
