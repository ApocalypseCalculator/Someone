import { EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export = {
    name: 'sblocked',
    description: 'Shows all blocked channels in a guild.',
    global: true,
    execute: async (interaction) => {
        let blocked = '';
        let chnllist = await prisma.channel.findMany({
            where: {
                guild: interaction.guildId ?? "-1",
                blocked: true
            }
        });

        chnllist.forEach(chnl => {
            blocked += `<#${chnl.channelid}> `;
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