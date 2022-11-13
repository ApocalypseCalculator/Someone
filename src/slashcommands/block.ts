import fs from 'fs';
import path from 'path';
import { SlashCommand } from '../typings/bot';
import { removeFromArray } from '../assets/functions';
import { BlockedChannelData } from '../typings/assets';
import { ApplicationCommandOptionType } from 'discord.js';

export = {
    name: 'block',
    description: 'Blocks a channel from using the bot.',
    global: true,
    options: [{
        name: 'channel',
        type: ApplicationCommandOptionType.Channel,
        description: 'Which channel to block from using the bot.',
        required: true,
    }],
    execute: (interaction) => {
        if(!interaction.memberPermissions?.has('Administrator', true)) {
            return interaction.reply({ content: 'not authorized', ephemeral: true });
        }

        const raw = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'blocked.json'), { encoding: 'utf-8' });
        const parsed: BlockedChannelData = JSON.parse(raw);

        const channel = interaction.options.get('channel', true).channel;
        if(channel) {
            if(parsed.blocked.includes(channel.id)) {
                parsed.blocked = removeFromArray(parsed.blocked, channel.id);
                const newRaw = JSON.stringify(parsed);

                fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'blocked.json'), newRaw);
                return interaction.reply('Channel re-enabled for @someone pings :D');
            } else {
                parsed.blocked.push(channel.id);
                const newRaw = JSON.stringify(parsed);

                fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'blocked.json'), newRaw);
                return interaction.reply('Channel disabled for @someone pings D:');
            }
        } else {
            return interaction.reply('Please mention a channel to disable/re-enable.');
        }
    },
} as SlashCommand;