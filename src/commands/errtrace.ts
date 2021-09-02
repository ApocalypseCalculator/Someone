import fs from 'fs';
import { Command } from '../typings/bot';
import { config } from '../assets/config';
import { BotError } from '../typings/assets';

export = {
    name: 'errtrace',
    verify: (msg) => {
        return config.hostID === msg?.author.id;
    },
    execute: (msg, args) => {
        if(args && args[0]) {
            const raw = fs.readFileSync('./data/err.json', { encoding: 'utf-8' });
            const parsed: BotError[] = JSON.parse(raw);

            const errs = parsed.filter(err => err.id === args[0]);
            if(errs.length == 0) {
                return msg.reply('No error with ID found.');
            } else {
                return msg.reply(`\`\`\`Error: ${errs[0].err}\nID: ${errs[0].id}\nTime: ${new Date(errs[0].time).toUTCString()}\nServer: ${errs[0].server}\nUser: ${errs[0].user}\nCommand: ${errs[0].command}\`\`\``);
            }
        } else {
            return msg.reply('Please provide ID');
        }
    },
} as Command;