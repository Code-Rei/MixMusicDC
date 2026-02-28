const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { createErrorEmbed } = require('../../utils/embed');
const { formatDuration } = require('../../utils/formatDuration');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('🔍 Search YouTube and pick a song')
        .addStringOption(opt =>
            opt.setName('query')
                .setDescription('Search term')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        await interaction.deferReply();

        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice?.channel;

        if (!voiceChannel) {
            return interaction.editReply({ embeds: [createErrorEmbed('🔇 Join a voice channel first!')] });
        }

        let results;
        try {
            results = await client.distube.search(query, { limit: 10, type: 'video' });
        } catch (err) {
            return interaction.editReply({ embeds: [createErrorEmbed(`Search failed: ${err.message?.slice(0, 200)}`)] });
        }

        if (!results || results.length === 0) {
            return interaction.editReply({ embeds: [createErrorEmbed('No results found.')] });
        }

        const options = results.map((r, i) => ({
            label: r.name?.slice(0, 100) ?? `Result ${i + 1}`,
            description: `${formatDuration(r.duration)} | ${r.uploader?.name?.slice(0, 50) ?? 'Unknown'}`,
            value: r.url,
        }));

        const menu = new StringSelectMenuBuilder()
            .setCustomId('search_select')
            .setPlaceholder('Choose a song...')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(menu);
        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(`🔍 Results for: ${query}`)
            .setDescription('Select a song from the dropdown below. Menu expires in 30s.');

        await interaction.editReply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'search_select' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30_000, max: 1 });

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
                await interaction.editReply({ embeds: [createErrorEmbed(err.message?.slice(0, 300) || 'Failed to play.')], components: [] });
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                interaction.editReply({ components: [] }).catch(() => { });
            }
        });
    },
};
