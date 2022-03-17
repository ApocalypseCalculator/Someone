import fs from 'fs';
import { SlashCommand } from '../typings/bot';
import { MessageEmbed } from 'discord.js';
import { GlobalLeaderboardTotalData, GlobalLeaderboardUserStats } from '../typings/assets';

export = {
    name: 'grank',
    description: 'Shows a user\'s global ping rank.',
    global: true,
    options: [{
        name: 'user',
        description: 'The user to check.',
        type: 'USER',
        required: true,
    }],
    execute: (interaction, client) => {
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

        const botUser = (element: GlobalLeaderboardUserStats) => element.discordID === interaction.options.getUser('user', true).id;
        const index = list.findIndex(botUser);
        if(index !== -1) {
            embed.addField('Ping Count', `<@!${interaction.options.getUser('user', true).id}> is ranked **#${(list.length - index)}** globally for pings received`);
            embed.addField('\u200B', '\u200B');

            return interaction.reply({ embeds: [embed] });
        } else {
            embed.addField('Ping Count', `<@!${interaction.options.getUser('user', true).id}> is not ranked`);
            embed.addField('\u200B', '\u200B');

            return interaction.reply({ embeds: [embed] });
        }
    },
} as SlashCommand;