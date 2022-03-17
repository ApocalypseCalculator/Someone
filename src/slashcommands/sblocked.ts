import fs from 'fs';
import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import { BlockedChannelData } from '../typings/assets';

export = {
    name: 'sblocked',
    description: 'Shows all blocked channels in a guild.',
    global: true,
    execute: (interaction) => {
        const rawData = fs.readFileSync('../data/blocked.json', { encoding: 'utf-8' });
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
            const embed = new MessageEmbed()
                .setColor(13833)
                .addField('Blocked channels in this server', (blocked === '') ? 'No blocked channels' : blocked);

            return interaction.reply({ embeds: [embed] });
        }
    },
} as SlashCommand;