import fs from 'fs';
import { MessageEmbed } from 'discord.js';
import { Command } from '../typings/bot';
import { GlobalLeaderboardTotalData, GlobalLeaderboardUserStats } from '../typings/assets';

export = {
    name: 'pingcount',
    verify: () => {
        return true;
    },
    execute: (msg, _args, client) => {
        const embed = new MessageEmbed()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .addField('\u200B', '\u200B')
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        if(msg.mentions.members && msg.mentions.members.size > 1) {
            return msg.reply('Bro please mention one user you want to check pings for');
        } else if(msg.mentions.members && msg.mentions.members.size == 0) {
            embed.setTitle(`Recorded Pings Received By ${msg.author.username}`);

            const rawData = fs.readFileSync('../data/globalLeaderboard.json', { encoding: 'utf-8' });
            const parsed: GlobalLeaderboardTotalData = JSON.parse(rawData);

            const botUser = (element: GlobalLeaderboardUserStats) => element.discordID === msg.author.id;
            const index = parsed.users.findIndex(botUser);
            if(index !== -1) {
                embed.addField('Ping Count', `<@!${msg.author.id}> has ${parsed.users[index].pinged} received ping${(parsed.users[index].pinged === 1) ? '' : 's'} through this bot`);
                embed.addField('\u200B', '\u200B');

                return msg.reply({ embeds: [embed] });
            } else {
                embed.addField('Ping Count', `<@${msg.author.id}> has 0 received pings through this bot`);
                embed.addField('\u200B', '\u200B');

                return msg.reply({ embeds: [embed] });
            }
        } else {
            embed.setTitle(`Recorded Pings Received By ${msg.mentions.users.first()?.username}`);

            const rawData = fs.readFileSync('./data/globalLeaderboard.json', { encoding: 'utf-8' });
            const parsed: GlobalLeaderboardTotalData = JSON.parse(rawData);

            const botUser = (element: GlobalLeaderboardUserStats) => element.discordID === msg.mentions.users.first()?.id;
            const index = parsed.users.findIndex(botUser);
            if(index !== -1) {
                embed.addField('Ping Count', `<@!${msg.mentions.users.first()?.id}> has ${parsed.users[index].pinged} received ping${(parsed.users[index].pinged == 1) ? '' : 's'} through this bot`);
                embed.addField('\u200B', '\u200B');

                return msg.reply({ embeds: [embed] });
            } else {
                embed.addField('Ping Count', `<@!${msg.mentions.users.first()?.id}> has 0 received pings through this bot`);
                embed.addField('\u200B', '\u200B');

                return msg.reply({ embeds: [embed] });
            }
        }
    },
} as Command;