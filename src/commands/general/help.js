const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('📋 Show all available commands'),

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle('🎵 MixMusicDC — Commands')
            .setDescription('Play music from YouTube, SoundCloud, and more!')
            .addFields(
                {
                    name: '🎵 Music',
                    value: [
                        '`/play` — Play a song or playlist',
                        '`/stop` — Stop and clear the queue',
                        '`/skip` — Skip to the next song',
                        '`/pause` — Pause playback',
                        '`/resume` — Resume playback',
                        '`/queue` — View the current queue',
                        '`/nowplaying` — Show the current song',
                        '`/volume` — Set the volume (1–100)',
                        '`/loop` — Set loop mode (off/song/queue)',
                        '`/shuffle` — Shuffle the queue',
                        '`/seek` — Seek to a timestamp',
                        '`/remove` — Remove a song from queue',
                        '`/move` — Move a song in the queue',
                        '`/filter` — Apply audio filters',
                        '`/autoplay` — Toggle autoplay',
                        '`/search` — Search and pick a song',
                        '`/lyrics` — Get song lyrics',
                        '`/playlist` — Show playlist info',
                    ].join('\n'),
                },
                {
                    name: '⚙️ General',
                    value: '`/help` — Show this message\n`/ping` — Check bot latency',
                }
            )
            .setFooter({ text: 'MixMusicDC • Powered by DisTube & yt-dlp' });

        await interaction.reply({ embeds: [embed] });
    },
};
