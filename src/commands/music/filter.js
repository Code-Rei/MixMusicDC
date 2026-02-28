const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');
const config = require('../../config');

const filterChoices = Object.keys(config.filters).map(k => ({ name: k, value: k }));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('🎛️ Apply or clear audio filters')
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription('Apply a filter')
                .addStringOption(opt =>
                    opt.setName('name')
                        .setDescription('Filter to apply')
                        .setRequired(true)
                        .addChoices(...filterChoices)
                )
        )
        .addSubcommand(sub =>
            sub.setName('clear')
                .setDescription('Clear all active filters')
        )
        .addSubcommand(sub =>
            sub.setName('list')
                .setDescription('List currently active filters')
        ),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) {
            return interaction.reply({ embeds: [createErrorEmbed('No music is currently playing.')], ephemeral: true });
        }
        if (interaction.member.voice?.channel?.id !== queue.voiceChannel?.id) {
            return interaction.reply({ embeds: [createErrorEmbed('You must be in the same voice channel.')], ephemeral: true });
        }

        const sub = interaction.options.getSubcommand();

        if (sub === 'clear') {
            queue.filters.clear();
            return interaction.reply({ embeds: [createSuccessEmbed('🎛️ All filters cleared.')] });
        }

        if (sub === 'list') {
            const active = queue.filters.names.join(', ') || 'None';
            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('🎛️ Active Filters')
                .setDescription(active);
            return interaction.reply({ embeds: [embed] });
        }

        // set
        const name = interaction.options.getString('name');
        if (queue.filters.names.includes(name)) {
            queue.filters.remove(name);
            return interaction.reply({ embeds: [createSuccessEmbed(`Removed filter **${name}**.`)] });
        } else {
            queue.filters.add(name);
            return interaction.reply({ embeds: [createSuccessEmbed(`Applied filter **${name}**.`)] });
        }
    },
};
