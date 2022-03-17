import fs from 'fs';
import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import { GlobalLeaderboardTotalData, GlobalLeaderboardUserStats } from '../typings/assets';

export = {
    name: 'pingcount',
    description: 'Shows number of pings received for a user.',
    global: true,
    options: [{
        name: 'user',
        description: 'The user to check.',
        type: 'USER',
        required: true,
    }],
    execute: (interaction, client) => {
        const embed = new MessageEmbed()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .addField('\u200B', '\u200B')
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        embed.setTitle(`Recorded Pings Received By ${interaction.options.getUser('user', true).username}`);

        const rawData = fs.readFileSync('./data/globalLeaderboard.json', { encoding: 'utf-8' });
        const parsed: GlobalLeaderboardTotalData = JSON.parse(rawData);

        const botUser = (element: GlobalLeaderboardUserStats) => element.discordID === interaction.options.getUser('user', true).id;
        const index = parsed.users.findIndex(botUser);
        if(index !== -1) {
            embed.addField('Ping Count', `<@!${interaction.options.getUser('user', true).id}> has ${parsed.users[index].pinged} received ping${(parsed.users[index].pinged == 1) ? '' : 's'} through this bot`);
            embed.addField('\u200B', '\u200B');

            return interaction.reply({ embeds: [embed] });
        } else {
            embed.addField('Ping Count', `<@!${interaction.options.getUser('user', true).id}> has 0 received pings through this bot`);
            embed.addField('\u200B', '\u200B');

            return interaction.reply({ embeds: [embed] });
        }
    },
} as SlashCommand;