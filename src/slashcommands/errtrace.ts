import fs from 'fs';
import path from 'path';
import { SlashCommand } from '../typings/bot';
import { config } from '../assets/config';
import { BotError } from '../typings/assets';
import { ApplicationCommandOptionType } from 'discord.js';

export = {
    name: 'errtrace',
    description: 'Shows details about an error trace.',
    global: true,
    options: [{
        name: 'id',
        description: 'The ID of the error trace.',
        type: ApplicationCommandOptionType.String,
        required: true,
    }],
    execute: (interaction) => {
        if(config.hostID !== interaction.user.id) {
            return interaction.reply({ content: 'not authorized', ephemeral: true });
        }

        const raw = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'err.json'), { encoding: 'utf-8' });
        const parsed: BotError[] = JSON.parse(raw);

        const errs = parsed.filter((err) => err.id === interaction.options.get('id', true).value);
        if(errs.length === 0) {
            return interaction.reply('No error with ID found.');
        } else {
            return interaction.reply(`\`\`\`Error: ${errs[0].err}\nID: ${errs[0].id}\nTime: ${new Date(errs[0].time).toUTCString()}\nServer: ${errs[0].server}\nUser: ${errs[0].user}\nCommand: ${errs[0].command}\`\`\``);
        }
    },
} as SlashCommand;