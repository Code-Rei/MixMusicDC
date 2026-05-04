const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('⏹️ Stop the music and clear the queue'),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) {
            return interaction.reply({ embeds: [createErrorEmbed('No music is currently playing.')], flags: 64 });
        }
        if (interaction.member.voice?.channel?.id !== queue.voiceChannel?.id) {
            return interaction.reply({ embeds: [createErrorEmbed('You must be in the same voice channel.')], flags: 64 });
        }
        await queue.stop();
        await interaction.reply({ embeds: [createSuccessEmbed('Stopped the music and cleared the queue.')] });
    },
};
