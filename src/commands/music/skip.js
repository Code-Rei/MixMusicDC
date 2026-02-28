const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('⏭️ Skip the current song'),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) {
            return interaction.reply({ embeds: [createErrorEmbed('No music is currently playing.')], ephemeral: true });
        }
        if (interaction.member.voice?.channel?.id !== queue.voiceChannel?.id) {
            return interaction.reply({ embeds: [createErrorEmbed('You must be in the same voice channel.')], ephemeral: true });
        }
        if (queue.songs.length <= 1) {
            await queue.stop();
            return interaction.reply({ embeds: [createSuccessEmbed('Skipped the last song. Queue is now empty.')] });
        }
        await queue.skip();
        await interaction.reply({ embeds: [createSuccessEmbed('⏭️ Skipped to the next song!')] });
    },
};
