import fs from 'fs';
import path from 'path';

import { Client, Collection } from 'discord.js';
import { token } from './assets/token';
import { Command, EventHandler, SlashCommand } from './typings/bot';

export class Someone extends Client {
    commands: Collection<string, Command>;
    slashcommands: Collection<string, SlashCommand>;

    constructor() {
        super({
            intents: 2675, // most guild-related non-privileged intents + the GUILD_MEMBERS intent
        });

        this.commands = new Collection();
        this.slashcommands = new Collection();
    }
}

const client = new Someone();

const events = fs.readdirSync(path.join(process.cwd(), 'src', 'events'));
function loadEvents() {
    for(const file of events) {
        const event: EventHandler = require(path.join(process.cwd(), 'src', 'events', file));
        client.on(event.name, event.callback.bind(client));
    }
}

loadEvents();

client.login(token);