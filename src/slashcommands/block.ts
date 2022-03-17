import fs from 'fs';
import { SlashCommand } from '../typings/bot';
import { removeFromArray } from '../assets/functions';
import { BlockedChannelData } from '../typings/assets';

export = {
    name: 'block',
    description: 'Blocks a channel from using the bot.',
    global: true,
    options: [{
        name: 'channel',
        type: 'CHANNEL',
        description: 'Which channel to block from using the bot.',
        required: true,
    }],
    execute: (interaction) => {
        if(!interaction.memberPermissions?.has('ADMINISTRATOR', true)) {
            return interaction.reply({ content: 'not authorized', ephemeral: true });
        }

        const raw = fs.readFileSync('../data/blocked.json', { encoding: 'utf-8' });
        const parsed: BlockedChannelData = JSON.parse(raw);

        if(interaction.options.getChannel('channel', true)) {
            if(parsed.blocked.includes(interaction.options.getChannel('channel', true).id)) {
                parsed.blocked = removeFromArray(parsed.blocked, interaction.options.getChannel('channel', true).id);
                const newRaw = JSON.stringify(parsed);

                fs.writeFileSync('../data/blocked.json', newRaw);
                return interaction.reply('Channel re-enabled for @someone pings :D');
            } else {
                parsed.blocked.push(interaction.options.getChannel('channel', true).id);
                const newRaw = JSON.stringify(parsed);

                fs.writeFileSync('../data/blocked.json', newRaw);
                return interaction.reply('Channel disabled for @someone pings D:');
            }
        } else {
            return interaction.reply('Please mention a channel to disable/re-enable.');
        }
    },
} as SlashCommand;