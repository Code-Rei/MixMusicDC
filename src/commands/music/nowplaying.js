const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createNowPlayingEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('🎶 Show what\'s currently playing'),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) {
            return interaction.reply({ embeds: [createErrorEmbed('No music is currently playing.')], ephemeral: true });
        }
        const embed = createNowPlayingEmbed(queue.songs[0], queue);
        await interaction.reply({ embeds: [embed] });
    },
};
