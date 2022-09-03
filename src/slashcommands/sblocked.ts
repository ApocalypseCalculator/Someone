import fs from 'fs';
import path from 'path';
import { EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import { BlockedChannelData } from '../typings/assets';

export = {
    name: 'sblocked',
    description: 'Shows all blocked channels in a guild.',
    global: true,
    execute: (interaction) => {
        const rawData = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'blocked.json'), { encoding: 'utf-8' });
        const parsed: BlockedChannelData = JSON.parse(rawData);

        let blocked = '';
        interaction.guild?.channels.cache.forEach((chnl) => {
            if(parsed.blocked.includes(chnl.id)) {
                blocked += `<#${chnl.id}> `;
            }
        });

        if(blocked.length > 1900) {
            return interaction.reply('Oof you have too many channels blocked in this server');
        } else {
            const embed = new EmbedBuilder()
                .setColor(13833)
                .addFields({ name: 'Blocked channels in this server', value: (blocked === '') ? 'No blocked channels' : blocked });

            return interaction.reply({ embeds: [embed] });
        }
    },
} as SlashCommand;