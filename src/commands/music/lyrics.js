const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createErrorEmbed } = require('../../utils/embed');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('📝 Get lyrics for the current or a specific song')
        .addStringOption(opt =>
            opt.setName('song')
                .setDescription('Song name (leave blank for current song)')
        ),

    async execute(interaction, client) {
        await interaction.deferReply();

        let songName = interaction.options.getString('song');

        if (!songName) {
            const queue = client.distube.getQueue(interaction.guild);
            if (!queue) {
                return interaction.editReply({ embeds: [createErrorEmbed('No music is playing. Provide a song name.')] });
            }
            songName = queue.songs[0].name;
        }

        try {
            const { getLyrics } = require('genius-lyrics-api');
            const options = {
                apiKey: process.env.GENIUS_API_KEY,
                title: songName,
                artist: '',
                optimizeQuery: true,
            };

            if (!process.env.GENIUS_API_KEY || process.env.GENIUS_API_KEY === 'insert_your_genius_key_here') {
                return interaction.editReply({ embeds: [createErrorEmbed('Genius API key not set. Add `GENIUS_API_KEY` to your `.env` file.')] });
            }

            const lyrics = await getLyrics(options);
            if (!lyrics) {
                return interaction.editReply({ embeds: [createErrorEmbed(`No lyrics found for **${songName}**.`)] });
            }

            const chunks = lyrics.match(/[\s\S]{1,3900}/g) || [];
            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle(`📝 ${songName}`)
                .setDescription(chunks[0])
                .setFooter({ text: chunks.length > 1 ? `Page 1/${chunks.length} — Lyrics truncated` : 'Powered by Genius' });

            await interaction.editReply({ embeds: [embed] });
        } catch (err) {
            console.error('[LYRICS ERROR]', err);
            await interaction.editReply({ embeds: [createErrorEmbed(`Failed to fetch lyrics: ${err.message?.slice(0, 200)}`)] });
        }
    },
};
