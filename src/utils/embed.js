const { EmbedBuilder } = require('discord.js');
const { RepeatMode } = require('distube');
const config = require('../config');
const { formatDuration } = require('./formatDuration');

function createProgressBar(current, total, size = 20) {
    if (!total || total === 0) return '';
    const pct = Math.min(current / total, 1);
    const filled = Math.round(size * pct);
    const empty = size - filled;
    return `\`${formatDuration(current)}\` ${'▓'.repeat(filled)}${'░'.repeat(empty)} \`${formatDuration(total)}\``;
}

function getLoopText(mode) {
    switch (mode) {
        case RepeatMode.SONG: return '🔂 Song';
        case RepeatMode.QUEUE: return '🔁 Queue';
        default: return '❌ Off';
    }
}

function createNowPlayingEmbed(song, queue) {
    const duration = song.isLive ? '🔴 LIVE' : formatDuration(song.duration);
    const progress = song.isLive ? '' : createProgressBar(queue.currentTime, song.duration);
    const filterNames = queue.filters?.names?.join(', ') || 'None';

    const embed = new EmbedBuilder()
        .setColor(config.colors.music)
        .setAuthor({ name: '🎶 Now Playing' })
        .setTitle(song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addFields(
            { name: '⏱️ Duration', value: duration, inline: true },
            { name: '👤 Requested by', value: song.user?.toString() ?? 'Unknown', inline: true },
            { name: '🔊 Volume', value: `${queue.volume}%`, inline: true },
            { name: '🔁 Loop', value: getLoopText(queue.repeatMode), inline: true },
            { name: '📋 Queue', value: `${queue.songs.length} song(s)`, inline: true },
            { name: '🎛️ Filter', value: filterNames, inline: true },
        )
        .setFooter({ text: `Source: ${song.source ?? 'Unknown'}` });

    if (progress) embed.setDescription(progress);
    return embed;
}

function createAddedEmbed(song, position) {
    return new EmbedBuilder()
        .setColor(config.colors.success)
        .setAuthor({ name: '✅ Added to Queue' })
        .setTitle(song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addFields(
            { name: '⏱️ Duration', value: song.isLive ? '🔴 LIVE' : formatDuration(song.duration), inline: true },
            { name: '📍 Position', value: `#${position}`, inline: true },
            { name: '👤 Requested by', value: song.user?.toString() ?? 'Unknown', inline: true },
        );
}

function createPlaylistEmbed(playlist, firstSong) {
    return new EmbedBuilder()
        .setColor(config.colors.music)
        .setAuthor({ name: '📂 Playlist Added' })
        .setTitle(playlist.name)
        .setURL(playlist.url ?? null)
        .setThumbnail(playlist.thumbnail ?? firstSong?.thumbnail ?? null)
        .addFields(
            { name: '🎵 Songs', value: `${playlist.songs.length}`, inline: true },
            { name: '⏱️ Total Duration', value: formatDuration(playlist.duration), inline: true },
            { name: '👤 Requested by', value: firstSong?.user?.toString() ?? 'Unknown', inline: true },
        );
}

function createErrorEmbed(message) {
    return new EmbedBuilder()
        .setColor(config.colors.error)
        .setTitle('❌ Error')
        .setDescription(String(message));
}

function createSuccessEmbed(message) {
    return new EmbedBuilder()
        .setColor(config.colors.success)
        .setDescription(`✅ ${message}`);
}

function createInfoEmbed(title, description) {
    return new EmbedBuilder()
        .setColor(config.colors.primary)
        .setTitle(title)
        .setDescription(description);
}

module.exports = {
    createNowPlayingEmbed,
    createAddedEmbed,
    createPlaylistEmbed,
    createErrorEmbed,
    createSuccessEmbed,
    createInfoEmbed,
    createProgressBar,
    formatDuration,
    getLoopText,
};
