const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('▶️ Resume paused music'),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) {
            return interaction.reply({ embeds: [createErrorEmbed('No music is currently playing.')], flags: 64 });
        }
        if (interaction.member.voice?.channel?.id !== queue.voiceChannel?.id) {
            return interaction.reply({ embeds: [createErrorEmbed('You must be in the same voice channel.')], flags: 64 });
        }
        if (!queue.paused) {
            return interaction.reply({ embeds: [createErrorEmbed('Music is not paused.')], flags: 64 });
        }
        queue.resume();
        await interaction.reply({ embeds: [createSuccessEmbed('▶️ Resumed the music.')] });
    },
};
