const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('🏓 Check the bot latency'),

    async execute(interaction, client) {
        const sent = await interaction.reply({ content: '🏓 Pinging...', fetchReply: true });
        const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
        const ws = client.ws.ping;

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle('🏓 Pong!')
            .addFields(
                { name: '📡 Roundtrip', value: `${roundtrip}ms`, inline: true },
                { name: '💓 Websocket', value: `${ws}ms`, inline: true },
            );

        await interaction.editReply({ content: null, embeds: [embed] });
    },
};
