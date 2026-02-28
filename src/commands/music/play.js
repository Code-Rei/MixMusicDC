const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('🎵 Play a song or playlist from YouTube')
        .addStringOption(opt =>
            opt.setName('query')
                .setDescription('Song name, URL, or playlist link')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        await interaction.deferReply();

        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice?.channel;

        if (!voiceChannel) {
            return interaction.editReply({ embeds: [createErrorEmbed('🔇 Join a voice channel first!')] });
        }

        const perms = voiceChannel.permissionsFor(interaction.guild.members.me);
        if (!perms?.has(['Connect', 'Speak'])) {
            return interaction.editReply({ embeds: [createErrorEmbed('🔒 I need **Connect** and **Speak** permissions!')] });
        }

        try {
            await client.distube.play(voiceChannel, query, {
                member: interaction.member,
                textChannel: interaction.channel,
                interaction,
            });

            if (!interaction.replied) {
                await interaction.editReply({ embeds: [createSuccessEmbed(`Searching for **${query}**...`)] });
            }
        } catch (err) {
            console.error('[PLAY ERROR]', err);
            const msg = err.message?.includes('No result')
                ? `No results found for **${query}**. Try a different search or URL.`
                : (err.message?.slice(0, 300) || 'Failed to play the requested track.');
            await interaction.editReply({ embeds: [createErrorEmbed(msg)] });
        }
    },
};
