const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('▶️ Resume paused music'),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) {
            return interaction.reply({ embeds: [createErrorEmbed('No music is currently playing.')], ephemeral: true });
        }
        if (interaction.member.voice?.channel?.id !== queue.voiceChannel?.id) {
            return interaction.reply({ embeds: [createErrorEmbed('You must be in the same voice channel.')], ephemeral: true });
        }
        if (!queue.paused) {
            return interaction.reply({ embeds: [createErrorEmbed('Music is not paused.')], ephemeral: true });
        }
        queue.resume();
        await interaction.reply({ embeds: [createSuccessEmbed('▶️ Resumed the music.')] });
    },
};
