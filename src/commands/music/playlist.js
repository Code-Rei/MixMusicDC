const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createErrorEmbed } = require('../../utils/embed');
const { formatDuration } = require('../../utils/formatDuration');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('📂 Show info about the current queue as a playlist'),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue || queue.songs.length === 0) {
            return interaction.reply({ embeds: [createErrorEmbed('The queue is empty.')], ephemeral: true });
        }

        const totalDuration = queue.songs.reduce((acc, s) => acc + (s.duration || 0), 0);
        const preview = queue.songs.slice(0, 5).map((s, i) =>
            `\`${i === 0 ? '▶' : i}.\` [${s.name}](${s.url}) \`${formatDuration(s.duration)}\``
        ).join('\n');

        const embed = new EmbedBuilder()
            .setColor(config.colors.music)
            .setTitle('📂 Current Playlist')
            .setDescription(preview + (queue.songs.length > 5 ? `\n*...and ${queue.songs.length - 5} more*` : ''))
            .setThumbnail(queue.songs[0].thumbnail)
            .addFields(
                { name: '🎵 Total Songs', value: `${queue.songs.length}`, inline: true },
                { name: '⏱️ Total Duration', value: formatDuration(totalDuration), inline: true },
                { name: '🔊 Volume', value: `${queue.volume}%`, inline: true },
                { name: '🔁 Loop', value: queue.repeatMode === 0 ? '❌ Off' : queue.repeatMode === 1 ? '🔂 Song' : '🔁 Queue', inline: true },
                { name: '🤖 Autoplay', value: queue.autoplay ? '✅ On' : '❌ Off', inline: true },
            );

        await interaction.reply({ embeds: [embed] });
    },
};
