const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createErrorEmbed } = require('../../utils/embed');
const { formatDuration } = require('../../utils/formatDuration');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('📋 Show the current queue')
        .addIntegerOption(opt =>
            opt.setName('page')
                .setDescription('Page number')
                .setMinValue(1)
        ),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue || queue.songs.length === 0) {
            return interaction.reply({ embeds: [createErrorEmbed('The queue is empty.')], flags: 64 });
        }

        const page = interaction.options.getInteger('page') || 1;
        const pageSize = config.queuePageSize;
        const pages = Math.ceil(queue.songs.length / pageSize);
        const clampedPage = Math.min(page, pages);
        const start = (clampedPage - 1) * pageSize;
        const end = start + pageSize;

        const songs = queue.songs.slice(start, end).map((s, i) => {
            const pos = start + i;
            const dur = s.isLive ? '🔴 LIVE' : formatDuration(s.duration);
            return pos === 0
                ? `▶️ **[${s.name}](${s.url})** \`${dur}\` — ${s.user}`
                : `\`${pos}.\` **[${s.name}](${s.url})** \`${dur}\` — ${s.user}`;
        });

        const totalDuration = formatDuration(queue.songs.reduce((acc, s) => acc + (s.duration || 0), 0));

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle('📋 Current Queue')
            .setDescription(songs.join('\n') || 'No songs.')
            .addFields(
                { name: '🎵 Total Songs', value: `${queue.songs.length}`, inline: true },
                { name: '⏱️ Total Duration', value: totalDuration, inline: true },
                { name: '🔊 Volume', value: `${queue.volume}%`, inline: true },
            )
            .setFooter({ text: `Page ${clampedPage} / ${pages}` });

        await interaction.reply({ embeds: [embed] });
    },
};
