import { config } from '../assets/config';
import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../typings/bot';

export = {
    name: 'commands',
    description: 'Displays the bot\'s commands.',
    global: true,
    execute: (interaction, client) => {
        const embed = new MessageEmbed()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .setTitle('Someone Bot Commands')
            .setDescription(`This is my command list, to see information about me do ${config.prefix}info.`)
            .addField('\u200B', '\u200B')
            .addField('Random Ping', 'ping me', true)
            .addField('Ping Command', config.prefix + 'ping', true)
            .addField('Webhook Clearing Command', config.prefix + 'whclear', true)
            .addField('Pings Received Counter Command', `${config.prefix}pingcount (alias ${config.prefix}pc)`, true)
            .addField('Global Ping Leaderboard', `${config.prefix}gleaderboard (alias ${config.prefix}glb)`, true)
            .addField('Server Ping Leaderboard', `${config.prefix}sleaderboard (alias ${config.prefix}slb)`, true)
            .addField('Check Global Rank', config.prefix + 'grank', true)
            .addField('Help Command', config.prefix + 'help', true)
            .addField('Create fake message with random user', `${config.prefix}fake`, true)
            .addField('Disabled/Re-enabled @someone', config.prefix + 'block', true)
            .addField('View disabled channels', `${config.prefix}sblocked`, true)
            .addField('Pick an amount of random members', `${config.prefix}random [n]`, true)
            .addField('Experimental Ping Contest Command', config.prefix + 'pingcontest (not available yet)', true)
            .addField('Information Page', config.prefix + 'info', true)
            .addField('This Page', `${config.prefix}commands (alias ${config.prefix}cmd)`, true)
            .addField('Privacy Policy', config.prefix + 'privacy', true)
            .addField('Invite', config.prefix + 'invite', true)
            .addField('\u200B', '\u200B')
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        return interaction.reply({ embeds: [embed] });
    },
} as SlashCommand;