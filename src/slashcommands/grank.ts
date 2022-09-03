import fs from 'fs';
import path from 'path';
import { SlashCommand } from '../typings/bot';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { GlobalLeaderboardTotalData, GlobalLeaderboardUserStats } from '../typings/assets';

export = {
    name: 'grank',
    description: 'Shows a user\'s global ping rank.',
    global: true,
    options: [{
        name: 'user',
        description: 'The user to check.',
        type: ApplicationCommandOptionType.User,
        required: true,
    }],
    execute: (interaction, client) => {
        const rawData = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'globalLeaderboard.json'), { encoding: 'utf-8' });
        const parsed: GlobalLeaderboardTotalData = JSON.parse(rawData);

        const list = parsed.users;
        list.sort((a, b) => (a.pinged > b.pinged) ? 1 : -1);

        const embed = new EmbedBuilder()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .setTitle('Global Ping Leaderboard Rank Information')
            .setDescription('Shows your global rank / someone else\'s rank')
            .addFields({ name: '\u200B', value: '\u200B' })
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        const botUser = (element: GlobalLeaderboardUserStats) => element.discordID === interaction.options.getUser('user', true).id;
        const index = list.findIndex(botUser);
        if(index !== -1) {
            embed.addFields({ name: 'Ping Count', value: `<@!${interaction.options.getUser('user', true).id}> is ranked **#${(list.length - index)}** globally for pings received` });
            embed.addFields({ name: '\u200B', value: '\u200B' });

            return interaction.reply({ embeds: [embed] });
        } else {
            embed.addFields({ name: 'Ping Count', value: `<@!${interaction.options.getUser('user', true).id}> is not ranked` });
            embed.addFields({ name: '\u200B', value: '\u200B' });

            return interaction.reply({ embeds: [embed] });
        }
    },
} as SlashCommand;