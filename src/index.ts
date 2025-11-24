import 'dotenv/config'

if(!process.env.TOKEN) {
    console.error('No token provided in environment variables. Please set TOKEN to your bot\'s token.');
    process.exit(1);
}

import fs from 'fs';
import path from 'path';

import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Command, EventHandler, SlashCommand } from './typings/bot';

export class Someone extends Client {
    commands: Collection<string, Command>;
    slashcommands: Collection<string, SlashCommand>;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildWebhooks,
            ], // most guild-related non-privileged intents + the GUILD_MEMBERS intent
        });

        this.commands = new Collection();
        this.slashcommands = new Collection();
    }
}

console.log('Starting...');

const client = new Someone();

const events = fs.readdirSync(path.join(process.cwd(), 'src', 'events'));
function loadEvents() {
    for(const file of events) {
        const event: EventHandler = require(path.join(process.cwd(), 'src', 'events', file));
        client.on(event.name, event.callback.bind(client));
    }
}

loadEvents();

client.login(process.env.TOKEN);