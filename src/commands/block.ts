import fs from 'fs';
import { Command } from '../typings/bot';
import { removeFromArray } from '../assets/functions';
import { BlockedChannelData } from '../typings/assets';

export = {
    name: 'block',
    verify: (msg) => {
        return msg?.member?.permissions.has('ADMINISTRATOR');
    },
    execute: (msg) => {
        const raw = fs.readFileSync('../data/blocked.json', { encoding: 'utf-8' });
        const parsed: BlockedChannelData = JSON.parse(raw);

        if(msg.mentions.channels.size === 1) {
            if(parsed.blocked.includes(msg.mentions.channels.first()!.id)) {
                parsed.blocked = removeFromArray(parsed.blocked, msg.mentions.channels.first()!.id);
                const newRaw = JSON.stringify(parsed);

                fs.writeFileSync('../data/blocked.json', newRaw);
                return msg.reply('Channel re-enabled for @someone pings :D');
            } else {
                parsed.blocked.push(msg.mentions.channels.first()!.id);
                const newRaw = JSON.stringify(parsed);

                fs.writeFileSync('../data/blocked.json', newRaw);
                return msg.reply('Channel disabled for @someone pings D:');
            }
        } else {
            return msg.reply('Please mention a channel to disable/re-enable.');
        }
    },
} as Command;