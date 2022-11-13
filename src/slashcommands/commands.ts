import { EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../typings/bot';

export = {
    name: 'commands',
    description: 'Displays the bot\'s commands.',
    global: true,
    execute: (interaction, client) => {
        const embed = new EmbedBuilder()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .setTitle('Someone Bot Commands')
            .setDescription('This is my command list, to see information about me do /info.')
            .addFields([
                {
                    name: '\u200B',
                    value: '\u200B',
                },
                {
                    name: 'Random Ping', value: 'ping me', inline: true,
                },
                {
                    name: 'Ping Command', value: '/ping', inline: true,
                },
                {
                    name: 'Webhook Clearing Command', value: '/whclear', inline: true,
                },
                {
                    name: 'Pings Received Counter Command', value: '/pingcount', inline: true,
                },
                {
                    name: 'Global Ping Leaderboard', value: '/gleaderboard', inline: true,
                },
                {
                    name: 'Server Ping Leaderboard', value: '/sleaderboard', inline: true,
                },
                {
                    name: 'Check Global Rank', value: '/grank', inline: true,
                },
                {
                    name: 'Help Command', value: '/help', inline: true,
                },
                {
                    name: 'Create fake message with random user', value: '/fake', inline: true,
                },
                {
                    name: 'Disabled/Re-enabled @someone', value: '/block', inline: true,
                },
                {
                    name: 'View disabled channels', value: '/sblocked', inline: true,
                },
                {
                    name: 'Pick an amount of random members', value: '/random [n]', inline: true,
                },
                {
                    name: 'Experimental Ping Contest Command', value: '/pingcontest (not available yet)', inline: true,
                },
                {
                    name: 'Information Page', value: '/info', inline: true,
                },
                {
                    name: 'This Page', value: '/commands', inline: true,
                },
                {
                    name: 'Privacy Policy', value: '/privacy', inline: true,
                },
                {
                    name: 'Invite', value: '/invite', inline: true,
                },
                {
                    name: '\u200B', value: '\u200B',
                },
            ])
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        return interaction.reply({ embeds: [embed] });
    },
} as SlashCommand;