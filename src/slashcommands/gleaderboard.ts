import { config } from '../assets/config';
import { EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export = {
    name: 'gleaderboard',
    description: 'A leaderboard of people who got pinged the most.',
    global: true,
    execute: async (interaction, client) => {
        const embed = new EmbedBuilder()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .setTitle('Global Ping Leaderboard')
            .setDescription('The following are the first 10 people on the leaderboard')
            .addFields({ name: '\u200B', value: '\u200B' })
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        let list = await prisma.user.findMany({
            orderBy: {
                pinged: 'desc'
            },
            take: 10
        });
        let total = await prisma.user.count();

        for (let i = 0; i < ((list.length < 10) ? list.length : 10); i++) {
            if (i === 0) {
                embed.addFields({ name: `#${(i + 1)}`, value: '🥇<@!' + list[i].discordid + '> ' + ((list[i].discordid === config.creatorID) ? '**(👑 bot creator)**' : '') + ': ' + list[i].pinged + ' pings' });
            } else if (i === 1) {
                embed.addFields({ name: `#${(i + 1)}`, value: '🥈<@!' + list[i].discordid + '> ' + ((list[i].discordid === config.creatorID) ? '**(👑 bot creator)**' : '') + ': ' + list[i].pinged + ' pings' });
            } else if (i === 2) {
                embed.addFields({ name: `#${(i + 1)}`, value: '🥉<@!' + list[i].discordid + '> ' + ((list[i].discordid === config.creatorID) ? '**(👑 bot creator)**' : '') + ': ' + list[i].pinged + ' pings' });
            } else {
                embed.addFields({ name: `#${(i + 1)}`, value: '🏅<@!' + list[i].discordid + '> ' + ((list[i].discordid === config.creatorID) ? '**(👑 bot creator)**' : '') + ': ' + list[i].pinged + ' pings' });
            }
        }

        embed.addFields({ name: '\u200B', value: `Out of ${total} ranked users` });
        embed.addFields({ name: '\u200B', value: '\u200B' });

        return interaction.reply({ embeds: [embed] });
    },
} as SlashCommand;