const { SlashCommandBuilder } = require('discord.js');
const { createErrorEmbed, createSuccessEmbed } = require('../../utils/embed');
const { RepeatMode } = require('distube');

const choices = [
    { name: '❌ Off', value: 'off' },
    { name: '🔂 Song', value: 'song' },
    { name: '🔁 Queue', value: 'queue' },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('🔁 Set the loop mode')
        .addStringOption(opt =>
            opt.setName('mode')
                .setDescription('Loop mode to set')
                .setRequired(true)
                .addChoices(...choices)
        ),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        if (!queue) {
            return interaction.reply({ embeds: [createErrorEmbed('No music is currently playing.')], flags: 64 });
        }
        if (interaction.member.voice?.channel?.id !== queue.voiceChannel?.id) {
            return interaction.reply({ embeds: [createErrorEmbed('You must be in the same voice channel.')], flags: 64 });
        }

        const mode = interaction.options.getString('mode');
        const modeMap = { off: RepeatMode.DISABLED, song: RepeatMode.SONG, queue: RepeatMode.QUEUE };
        queue.setRepeatMode(modeMap[mode]);

        const labels = { off: '❌ Off', song: '🔂 Song', queue: '🔁 Queue' };
        await interaction.reply({ embeds: [createSuccessEmbed(`Loop mode set to **${labels[mode]}**`)] });
    },
};
