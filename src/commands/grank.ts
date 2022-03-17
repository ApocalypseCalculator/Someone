import fs from 'fs';
import { Command } from '../typings/bot';
import { MessageEmbed } from 'discord.js';
import { GlobalLeaderboardTotalData, GlobalLeaderboardUserStats } from '../typings/assets';

export = {
    name: 'grank',
    verify: () => {
        return true;
    },
    execute: (msg, _args, client) => {
        const rawData = fs.readFileSync('./data/globalLeaderboard.json', { encoding: 'utf-8' });
        const parsed: GlobalLeaderboardTotalData = JSON.parse(rawData);

        const list = parsed.users;
        list.sort((a, b) => (a.pinged > b.pinged) ? 1 : -1);

        const embed = new MessageEmbed()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .setTitle('Global Ping Leaderboard Rank Information')
            .setDescription('Shows your global rank, to show someone else\'s rank, append a ping to the command')
            .addField('\u200B', '\u200B')
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        if(msg.mentions.members && msg.mentions.members.size > 1) {
            return msg.reply('Bro please mention one user you want to check pings for');
        } else if(msg.mentions.members && msg.mentions.members.size === 0) {
            const botUser = (element: GlobalLeaderboardUserStats) => element.discordID === msg.author.id;
            const index = list.findIndex(botUser);
            if(index !== -1) {
                embed.addField('Rank info', `<@!${msg.author.id}> is ranked **#${(list.length - index)}** globally for pings received`);
                embed.addField('\u200B', '\u200B');

                return msg.reply({ embeds: [embed] });
            } else {
                embed.addField('Rank info', `<@!${msg.author.id}> is not ranked`);
                embed.addField('\u200B', '\u200B');

                return msg.reply({ embeds: [embed] });
            }
        } else {
            const botUser = (element: GlobalLeaderboardUserStats) => element.discordID === msg.mentions.users.first()?.id;
            const index = list.findIndex(botUser);
            if(index !== -1) {
                embed.addField('Ping Count', `<@!${msg.mentions.users.first()?.id}> is ranked **#${(list.length - index)}** globally for pings received`);
                embed.addField('\u200B', '\u200B');

                return msg.reply({ embeds: [embed] });
            } else {
                embed.addField('Ping Count', `<@!${msg.mentions.users.first()?.id}> is not ranked`);
                embed.addField('\u200B', '\u200B');

                return msg.reply({ embeds: [embed] });
            }
        }
    },
} as Command;