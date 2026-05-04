const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');
const { formatDuration } = require('../../utils/formatDuration');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('⏱️ Seek to a position in the current song')
        .addIntegerOption(opt =>
            opt.setName('seconds')
                .setDescription('Position in seconds')
                .setMinValue(0)
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) {
            return interaction.reply({ embeds: [createErrorEmbed('No music is currently playing.')], flags: 64 });
        }
        if (interaction.member.voice?.channel?.id !== queue.voiceChannel?.id) {
            return interaction.reply({ embeds: [createErrorEmbed('You must be in the same voice channel.')], flags: 64 });
        }
        const song = queue.songs[0];
        if (song.isLive) {
            return interaction.reply({ embeds: [createErrorEmbed('Cannot seek on a live stream.')], flags: 64 });
        }

        const seconds = interaction.options.getInteger('seconds');
        if (seconds >= song.duration) {
            return interaction.reply({ embeds: [createErrorEmbed(`Seek time exceeds song duration (\`${formatDuration(song.duration)}\`).`)], flags: 64 });
        }

        await queue.seek(seconds);
        await interaction.reply({ embeds: [createSuccessEmbed(`⏱️ Seeked to \`${formatDuration(seconds)}\``)] });
    },
};
