/**
 * /ytsearch — Search YouTube Music and pick a track to play
 *
 * Uses ytmusic-api to get richer metadata (thumbnails, artist, album, duration)
 * then hands the chosen URL off to DisTube for playback.
 */

const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} = require('discord.js');
const { createErrorEmbed } = require('../../utils/embed');
const { formatDuration } = require('../../utils/formatDuration');
const { getYTMusic } = require('../../utils/ytmusic');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ytsearch')
        .setDescription('🎵 Search YouTube Music and pick a track')
        .addStringOption(opt =>
            opt.setName('query')
                .setDescription('Song name, artist, or album')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        await interaction.deferReply();

        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice?.channel;

        if (!voiceChannel) {
            return interaction.editReply({
                embeds: [createErrorEmbed('🔇 Join a voice channel first!')],
            });
        }

        let songs;
        try {
            const ytm = await getYTMusic();
            songs = await ytm.searchSongs(query);
        } catch (err) {
            console.error('[YTSEARCH] Search error:', err);
            return interaction.editReply({
                embeds: [createErrorEmbed(`YouTube Music search failed: ${err.message?.slice(0, 200)}`)],
            });
        }

        if (!songs || songs.length === 0) {
            return interaction.editReply({
                embeds: [createErrorEmbed('No results found on YouTube Music.')],
            });
        }

        // Take top 10 results
        const top = songs.slice(0, 10);

        const options = top.map((song, i) => {
            const artistName = song.artist?.name ?? song.artists?.[0]?.name ?? 'Unknown Artist';
            const dur = song.duration ? formatDuration(Math.round(song.duration / 1000)) : '?:??';
            return {
                label: (song.name ?? `Result ${i + 1}`).slice(0, 100),
                description: `${dur} · ${artistName.slice(0, 50)}`,
                value: `https://music.youtube.com/watch?v=${song.videoId}`,
            };
        });

        const menu = new StringSelectMenuBuilder()
            .setCustomId('ytsearch_select')
            .setPlaceholder('Choose a track…')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(menu);

        // Use the thumbnail from the first result if available
        const thumb = top[0]?.thumbnails?.at(-1)?.url ?? null;

        const embed = new EmbedBuilder()
            .setColor(config.colors.music)
            .setTitle(`🎵 YouTube Music · "${query}"`)
            .setDescription(`Found **${songs.length}** results — select one below (expires in 30 s)`)
            .setFooter({ text: 'Powered by ytmusic-api' });

        if (thumb) embed.setThumbnail(thumb);

        await interaction.editReply({ embeds: [embed], components: [row] });

        // Collector: wait for the user's pick
        const filter = i =>
            i.customId === 'ytsearch_select' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 30_000,
            max: 1,
        });

        collector.on('collect', async i => {
            const url = i.values[0];
            await i.update({ components: [] });

            try {
                await client.distube.play(voiceChannel, url, {
                    member: interaction.member,
                    textChannel: interaction.channel,
                    interaction,
                });
            } catch (err) {
                await interaction.editReply({
                    embeds: [createErrorEmbed(err.message?.slice(0, 300) || 'Failed to play track.')],
                    components: [],
                });
            }
        });

        collector.on('end', (_, reason) => {
            if (reason === 'time') {
                interaction.editReply({ components: [] }).catch(() => { });
            }
        });
    },
};
