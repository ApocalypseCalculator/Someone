import fs from 'fs';
import path from 'path';
import { Client, Collection } from 'discord.js';
import { token } from './assets/token';
import { Command, SlashCommand } from './typings/bot';

export class Someone extends Client {
    commands: Collection<string, Command>;
    slashcommands: Collection<string, SlashCommand>;

    constructor() {
        super({
            intents: 2675, // most guild-related non-privileged + the GUILD_MEMBERS intent
        });

        this.commands = new Collection();
        this.slashcommands = new Collection();
    }
}

const client = new Someone();

fs.readdirSync(path.join(process.cwd(), 'src', 'commands')).forEach((file) => {
    const command: Command = require(path.join(process.cwd(), 'src', 'commands', `${file}`));
    if (command.name == null || command.execute == null) {
        console.error(`\x1b[31mInvalid command: ${file}\x1b[0m`);
    } else if (command.name in client.commands) {
        console.error(`\x1b[31mDuplicate command name: ${file} (${command.name})\x1b[0m`);
    } else {
        client.commands.set(command.name, command);
        console.log(`Loaded command: ${file} (${command.name})`);
    }
});

client.login(token);