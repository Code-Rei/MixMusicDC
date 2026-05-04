const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('⏸️ Pause the current song'),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) {
            return interaction.reply({ embeds: [createErrorEmbed('No music is currently playing.')], flags: 64 });
        }
        if (interaction.member.voice?.channel?.id !== queue.voiceChannel?.id) {
            return interaction.reply({ embeds: [createErrorEmbed('You must be in the same voice channel.')], flags: 64 });
        }
        if (queue.paused) {
            return interaction.reply({ embeds: [createErrorEmbed('Music is already paused. Use `/resume` to unpause.')], flags: 64 });
        }
        queue.pause();
        await interaction.reply({ embeds: [createSuccessEmbed('⏸️ Paused the music.')] });
    },
};
