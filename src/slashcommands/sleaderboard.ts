import { config } from '../assets/config';
import { EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export = {
    name: 'sleaderboard',
    description: 'Shows the server leaderboard for pings.',
    global: true,
    execute: async (interaction, client) => {
        const embed = new EmbedBuilder()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .setTitle('Server Ping Leaderboard')
            .setDescription('The following are the first 10 people on the leaderboard')
            .addFields({ name: '\u200B', value: '\u200B' })
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        const querylist = await prisma.user.findMany(
            {
                orderBy: {
                    pinged: 'desc'
                }
            }
        );
        const list = querylist.filter((user) => interaction.guild?.members.cache.get(user.discordid));
        for(let i = 0; i < ((list.length < 10) ? list.length : 10); i++) {
            if(i === 0) {
                embed.addFields({ name: `#${(i + 1)}`, value: '🥇<@!' + list[list.length - i - 1].discordid + '> ' + ((list[list.length - i - 1].discordid === config.creatorID) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings' });
            } else if(i === 1) {
                embed.addFields({ name: `#${(i + 1)}`, value: '🥈<@!' + list[list.length - i - 1].discordid + '> ' + ((list[list.length - i - 1].discordid === config.creatorID) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings' });
            } else if(i === 2) {
                embed.addFields({ name: `#${(i + 1)}`, value: '🥉<@!' + list[list.length - i - 1].discordid + '> ' + ((list[list.length - i - 1].discordid === config.creatorID) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings' });
            } else {
                embed.addFields({ name: `#${(i + 1)}`, value: '🏅<@!' + list[list.length - i - 1].discordid + '> ' + ((list[list.length - i - 1].discordid === config.creatorID) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings' });
            }
        }

        embed.addFields({ name: '\u200B', value: 'Out of ' + list.length + ' ranked users' });
        embed.addFields({ name: '\u200B', value: '\u200B' });

        return interaction.reply({ embeds: [embed] });
    },
} as SlashCommand;