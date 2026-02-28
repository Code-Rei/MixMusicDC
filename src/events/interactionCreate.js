const { createErrorEmbed } = require('../utils/embed');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) {
            return interaction.reply({
                embeds: [createErrorEmbed(`Command \`/${interaction.commandName}\` not found.`)],
                ephemeral: true,
            });
        }

        try {
            await command.execute(interaction, client);
        } catch (err) {
            console.error(`[CMD ERROR] /${interaction.commandName}:`, err);
            const msg = err.message?.length > 200 ? 'An unexpected error occurred.' : (err.message || 'An unexpected error occurred.');
            const embed = createErrorEmbed(msg);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [embed], ephemeral: true }).catch(() => { });
            } else {
                await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => { });
            }
        }
    },
};
