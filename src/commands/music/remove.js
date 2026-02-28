const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('🗑️ Remove a song from the queue')
        .addIntegerOption(opt =>
            opt.setName('position')
                .setDescription('Song position in queue (use /queue to see positions)')
                .setMinValue(1)
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

        const pos = interaction.options.getInteger('position');
        if (pos >= queue.songs.length) {
            return interaction.reply({ embeds: [createErrorEmbed(`Invalid position. Queue has \`${queue.songs.length - 1}\` queued songs.`)], ephemeral: true });
        }

        const removed = queue.songs[pos];
        queue.songs.splice(pos, 1);
        await interaction.reply({ embeds: [createSuccessEmbed(`Removed **${removed.name}** from the queue.`)] });
    },
};
