const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const fs = require('fs');
const path = require('path');
const config = require('./config');

let client;

function createClient() {
    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates,
        ],
        partials: [Partials.Channel],
    });

    client.commands = new Collection();

    client.distube = new DisTube(client, {
        plugins: [new YtDlpPlugin({ update: false })],
    });

    return client;
}

function loadCommands(client) {
    const commandsPath = path.join(__dirname, 'commands');
    for (const folder of fs.readdirSync(commandsPath)) {
        const folderPath = path.join(commandsPath, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;
        for (const file of fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))) {
            const command = require(path.join(folderPath, file));
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                console.log(`[CMD] Loaded: /${command.data.name}`);
            } else {
                console.warn(`[CMD] Skipped ${file} — missing data or execute`);
            }
        }
    }
}

function loadEvents(client) {
    const eventsPath = path.join(__dirname, 'events');
    for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
        const event = require(path.join(eventsPath, file));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
        console.log(`[EVT] Loaded: ${event.name}`);
    }

    // DisTube events
    const distubePath = path.join(__dirname, 'events', 'distube');
    if (fs.existsSync(distubePath)) {
        for (const file of fs.readdirSync(distubePath).filter(f => f.endsWith('.js'))) {
            const event = require(path.join(distubePath, file));
            client.distube.on(event.name, (...args) => event.execute(...args, client));
            console.log(`[DISTUBE] Loaded: ${event.name}`);
        }
    }
}

async function startBot() {
    createClient();
    loadCommands(client);
    loadEvents(client);

    try {
        await client.login(process.env.DISCORD_TOKEN);
    } catch (err) {
        console.error('[BOT] Login failed:', err.message);
        process.exit(1);
    }
}

module.exports = { startBot, getClient: () => client };
