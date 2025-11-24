import { SlashCommand } from '../typings/bot';
import createBaseEmbed from '../lib/embed';

export = {
    name: 'commands',
    description: 'Displays the bot\'s commands.',
    execute: (interaction, client) => {
        const embed = createBaseEmbed(
            client,
            'Someone Bot Commands',
            'This is my command list, to see information about me do /info.'
        ).addFields([
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
            }
        ]);

        return interaction.reply({ embeds: [embed] });
    },
} as SlashCommand;