import { MessageEmbed } from 'discord.js';
import { version } from '../../package.json';
import { config } from '../assets/config';
import { Command } from '../typings/bot';

export = {
    name: 'info',
    verify: () => {
        return true;
    },
    execute: (msg, _args, client) => {
        const embed = new MessageEmbed()
            .setColor(13833)
            .setAuthor(client!.user!.username, client!.user!.avatarURL() as string)
            .setTitle('Information About Someone Bot')
            .setDescription(`whats up. I am the annoying pinger bot called Someone. Developed by ApocalypseCalculator (<@${config.creatorID}>). To use my annoying feature, simply ping me. These are the other commands of this wonderful Someone bot.\n\nTip: random ping/fake msg users are logged inside server audit log, inside webhook creation reason`)
            .addField('\u200B', '\u200B')
            .addField('Version', version, true)
            .addField('Server Count', `${client!.guilds.cache.size}`, true)
            .addField('Bot List Links', '[top.gg](https://top.gg/bot/705135432588853288)', true)
            .addField('Vote Links', '[top.gg](https://top.gg/bot/705135432588853288/vote)', true)
            .addField('Invite Links', '[Click Here!](https://discord.com/api/oauth2/authorize?client_id=705135432588853288&permissions=8&scope=bot%20applications.commands)', true)
            .addField('Support Discord Server', '[Someone Support](https://discord.gg/5WmPnYx)', true)
            .addField('GitHub Repository', '[ApocalypseCalculator/Someone](https://github.com/ApocalypseCalculator/Someone)', true)
            .addField('Commands List', `${config.prefix}commands`, true)
            .addField('This Page', `${config.prefix}info`, true)
            .addField('\u200B', '\u200B')
            .setTimestamp()
            .setFooter('Someone Bot By ApocalypseCalculator - Licensed', client!.user!.avatarURL() as string);

        return msg.reply({ embeds: [embed] });
    },
} as Command;