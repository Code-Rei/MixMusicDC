const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('↕️ Move a song to a different queue position')
        .addIntegerOption(opt =>
            opt.setName('from')
                .setDescription('Current position of the song')
                .setMinValue(1)
                .setRequired(true)
        )
        .addIntegerOption(opt =>
            opt.setName('to')
                .setDescription('Target position')
                .setMinValue(1)
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) {
            return interaction.reply({ embeds: [createErrorEmbed('No music is currently playing.')], flags: 64 });
        }
        if (interaction.member.voice?.channel?.id !== queue.voiceChannel?.id) {
            return interaction.reply({ embeds: [createErrorEmbed('You must be in the same voice channel.')], flags: 64 });
        }

        const from = interaction.options.getInteger('from');
        const to = interaction.options.getInteger('to');

        if (from >= queue.songs.length || to >= queue.songs.length) {
            return interaction.reply({ embeds: [createErrorEmbed(`Invalid positions. Queue has \`${queue.songs.length - 1}\` queued songs.`)], flags: 64 });
        }
        if (from === to) {
            return interaction.reply({ embeds: [createErrorEmbed('From and To positions cannot be the same.')], flags: 64 });
        }

        const [song] = queue.songs.splice(from, 1);
        queue.songs.splice(to, 0, song);
        await interaction.reply({ embeds: [createSuccessEmbed(`Moved **${song.name}** from position \`${from}\` to \`${to}\`.`)] });
    },
};
