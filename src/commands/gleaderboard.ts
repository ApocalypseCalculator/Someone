import fs from 'fs';
import { config } from '../assets/config';
import { MessageEmbed } from 'discord.js';
import { Command } from '../typings/bot';
import { GlobalLeaderboardTotalData } from '../typings/assets';

export = {
    name: 'gleaderboard',
    verify: () => {
        return true;
    },
    execute: (msg, _args, client) => {
        const embed = new MessageEmbed()
            .setColor(13833)
            .setAuthor(client!.user!.username, client!.user!.avatarURL() as string)
            .setTitle('Global Ping Leaderboard')
            .setDescription('The following are the first 10 people on the leaderboard')
            .addField('\u200B', '\u200B')
            .setTimestamp()
            .setFooter('Someone Bot By ApocalypseCalculator - Licensed', client!.user!.avatarURL() as string);

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

        return msg.reply({ embeds: [embed] });
    },
} as Command;