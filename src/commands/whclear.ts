import { TextChannel } from 'discord.js';
import { config } from '../assets/config';
import { Command } from '../typings/bot';

export = {
    name: 'whclear',
    verify: (msg) => {
        return msg?.member?.permissions.has('MANAGE_WEBHOOKS');
    },
    execute: (msg) => {
        (msg.channel as TextChannel).fetchWebhooks().then((hooks) => {
            hooks.forEach((hook) => {
                hook.delete(`Webhook clearing command run by ${msg.author.tag}`);
            });
        }).catch((error) => {
            console.log(error);
            return msg.reply(`Error on clearing webhooks. Try again or contact the bot creator in the support server if this problem persists (server invite with \`${config.prefix}info\` command)`);
        });

        return msg.reply('webhooks cleared');
    },
} as Command;