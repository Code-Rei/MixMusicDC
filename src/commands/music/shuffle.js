const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('🔀 Shuffle the queue'),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) {
            return interaction.reply({ embeds: [createErrorEmbed('No music is currently playing.')], ephemeral: true });
        }
        if (interaction.member.voice?.channel?.id !== queue.voiceChannel?.id) {
            return interaction.reply({ embeds: [createErrorEmbed('You must be in the same voice channel.')], ephemeral: true });
        }
        if (queue.songs.length < 2) {
            return interaction.reply({ embeds: [createErrorEmbed('Need at least 2 songs in the queue to shuffle.')], ephemeral: true });
        }
        await queue.shuffle();
        await interaction.reply({ embeds: [createSuccessEmbed(`🔀 Shuffled **${queue.songs.length}** songs!`)] });
    },
};
