import fs from 'fs';
import { config } from '../assets/config';
import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import { GlobalLeaderboardTotalData } from '../typings/assets';

export = {
    name: 'gleaderboard',
    description: 'A leaderboard of people who got pinged the most.',
    global: true,
    execute: (interaction, client) => {
        const embed = new MessageEmbed()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .setTitle('Global Ping Leaderboard')
            .setDescription('The following are the first 10 people on the leaderboard')
            .addField('\u200B', '\u200B')
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        const rawData = fs.readFileSync('../data/globalLeaderboard.json', { encoding: 'utf-8' });
        const parsed: GlobalLeaderboardTotalData = JSON.parse(rawData);

        const list = parsed.users;
        list.sort((a, b) => (a.pinged > b.pinged) ? 1 : -1);

        for(let i = 0; i < ((list.length < 10) ? list.length : 10); i++) {
            if(i === 0) {
                embed.addField(`#${(i + 1)}`, '🥇<@!' + list[list.length - i - 1].discordID + '> ' + ((list[list.length - i - 1].discordID === config.creatorID) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings');
            } else if(i === 1) {
                embed.addField(`#${(i + 1)}`, '🥈<@!' + list[list.length - i - 1].discordID + '> ' + ((list[list.length - i - 1].discordID === config.creatorID) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings');
            } else if(i === 2) {
                embed.addField(`#${(i + 1)}`, '🥉<@!' + list[list.length - i - 1].discordID + '> ' + ((list[list.length - i - 1].discordID === config.creatorID) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings');
            } else {
                embed.addField(`#${(i + 1)}`, '🏅<@!' + list[list.length - i - 1].discordID + '> ' + ((list[list.length - i - 1].discordID === config.creatorID) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings');
            }
        }

        embed.addField('\u200B', `Out of ${list.length} ranked users`);
        embed.addField('\u200B', '\u200B');

        return interaction.reply({ embeds: [embed] });
    },
} as SlashCommand;