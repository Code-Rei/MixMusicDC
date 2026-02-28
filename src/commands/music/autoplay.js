const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('🤖 Toggle autoplay (auto-queue related songs)'),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) {
            return interaction.reply({ embeds: [createErrorEmbed('No music is currently playing.')], ephemeral: true });
        }
        if (interaction.member.voice?.channel?.id !== queue.voiceChannel?.id) {
            return interaction.reply({ embeds: [createErrorEmbed('You must be in the same voice channel.')], ephemeral: true });
        }

        const state = queue.toggleAutoplay();
        await interaction.reply({
            embeds: [createSuccessEmbed(`🤖 Autoplay is now **${state ? 'ON' : 'OFF'}**.`)],
        });
    },
};
