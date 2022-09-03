import { EmbedBuilder } from 'discord.js';
import { version } from '../../package.json';
import { config } from '../assets/config';
import { SlashCommand } from '../typings/bot';

export = {
    name: 'info',
    description: 'Gets info about the bot.',
    global: true,
    execute: (interaction, client) => {
        const embed = new EmbedBuilder()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .setTitle('Information About Someone Bot')
            .setDescription(`whats up. I am the annoying pinger bot called Someone. Developed by ApocalypseCalculator (<@${config.creatorID}>). To use my annoying feature, simply ping me. These are the other commands of this wonderful Someone bot.\n\nTip: random ping/fake msg users are logged inside server audit log, inside webhook creation reason`)
            .addFields([
                {
                    name: '\u200B',
                    value: '\u200B',
                },
                {
                    name: 'Version',
                    value: version,
                    inline: true,
                },
                {
                    name: 'Server Count',
                    value: `${client?.guilds.cache.size}`,
                    inline: true,
                },
                {
                    name: 'Bot List Links',
                    value: '[top.gg](https://top.gg/bot/705135432588853288)',
                    inline: true,
                },
                {
                    name: 'Vote Links',
                    value: '[top.gg](https://top.gg/bot/705135432588853288/vote)',
                    inline: true,
                },
                {
                    name: 'Invite Links',
                    value: '[Click Here!](https://discord.com/api/oauth2/authorize?client_id=705135432588853288&permissions=8&scope=bot%20applications.commands)',
                    inline: true,
                },
                {
                    name: 'Support Discord Server',
                    value: '[Someone Support](https://discord.gg/5WmPnYx)',
                    inline: true,
                },
                {
                    name: 'GitHub Repository',
                    value: '[ApocalypseCalculator/Someone](https://github.com/ApocalypseCalculator/Someone)',
                    inline: true,
                },
                {
                    name: 'Commands List',
                    value: '/commands',
                    inline: true,
                },
                {
                    name: 'This Page',
                    value: '/info',
                    inline: true,
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                },
            ])
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        return interaction.reply({ embeds: [embed] });
    },
} as SlashCommand;