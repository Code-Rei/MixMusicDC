const { EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: 'disconnect',
    execute(queue, client) {
        const embed = new EmbedBuilder()
            .setColor(config.colors.warning)
            .setDescription('👋 Disconnected from voice channel. Queue cleared.');
        queue.textChannel?.send({ embeds: [embed] }).catch(() => { });
    },
};
