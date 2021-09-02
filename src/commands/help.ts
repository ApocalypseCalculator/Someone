import { config } from '../assets/config';
import { Command } from '../typings/bot';

export = {
    name: 'help',
    verify: () => {
        return true;
    },
    execute: (msg) => {
        return msg.reply(`Do \`${config.prefix}info\` for my information page and \`${config.prefix}commands\` for my commands list`);
    },
} as Command;