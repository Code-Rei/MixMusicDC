require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

for (const folder of fs.readdirSync(commandsPath)) {
    const folderPath = path.join(commandsPath, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;
    for (const file of fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))) {
        const command = require(path.join(folderPath, file));
        if ('data' in command) {
            commands.push(command.data.toJSON());
        }
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    const isGuild = process.argv.includes('--guild');
    try {
        console.log(`Deploying ${commands.length} command(s)${isGuild ? ' to guild' : ' globally'}...`);
        if (isGuild) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            );
            console.log('Guild commands deployed!');
        } else {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            console.log('Global commands deployed!');
        }
    } catch (err) {
        console.error('Deploy failed:', err);
    }
})();
