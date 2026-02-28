const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('🔊 Set the playback volume')
        .addIntegerOption(opt =>
            opt.setName('level')
                .setDescription('Volume level (1–100)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) {
            return interaction.reply({ embeds: [createErrorEmbed('No music is currently playing.')], ephemeral: true });
        }
        if (interaction.member.voice?.channel?.id !== queue.voiceChannel?.id) {
            return interaction.reply({ embeds: [createErrorEmbed('You must be in the same voice channel.')], ephemeral: true });
        }
        const level = interaction.options.getInteger('level');
        queue.setVolume(level);
        await interaction.reply({ embeds: [createSuccessEmbed(`🔊 Volume set to **${level}%**`)] });
    },
};
