const { SlashCommandBuilder } = require('discord.js');
const { SoundCloudPlugin } = require('@distube/soundcloud');

// THE FIX: We create an active instance of the plugin to unlock the search function
const scSearcher = new SoundCloudPlugin({
    clientId: '1IzwHiVxAHeYKAMqN0IIGD3ZARgJy2kl'
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from SoundCloud or a direct stream URL')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The song name or a direct web stream link')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        // 1. Check if the user is in a voice channel
        const voiceChannel = interaction.member?.voice?.channel;
        if (!voiceChannel) {
            return interaction.reply({
                content: "❌ You need to be in a voice channel to play music!",
                ephemeral: true
            });
        }

        // 2. Grab the user's input safely
        let query = interaction.options.getString('song') || interaction.options.getString('query');

        if (!query) {
            return interaction.reply({
                content: "❌ I couldn't read your input! Please try again.",
                ephemeral: true
            });
        }

        // 3. Defer the reply so Discord doesn't timeout
        await interaction.deferReply();

        try {
            // 4. If it's plain text (not a link), search SoundCloud using our new searcher
            if (!query.startsWith('http')) {
                const searchResults = await scSearcher.search(query, 'track', 1);

                if (!searchResults || searchResults.length === 0) {
                    return interaction.editReply("❌ No results found on SoundCloud.");
                }

                query = searchResults[0];
            }

            // 5. Send the track (or direct URL) to DisTube
            await client.distube.play(voiceChannel, query, {
                member: interaction.member,
                textChannel: interaction.channel,
            });

            await interaction.editReply("🎵 Playing track!");

        } catch (error) {
            console.error('[PLAY ERROR]', error);
            await interaction.editReply("❌ An error occurred while trying to play the track.");
        }
    }
};