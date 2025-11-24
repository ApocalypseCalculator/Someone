import { version } from '../../package.json';
import { SlashCommand } from '../typings/bot';
import createBaseEmbed from '../lib/embed';

// we can leave the info here hardcoded
export = {
    name: 'info',
    description: 'Gets info about the bot.',
    execute: (interaction, client) => {
        const embed = createBaseEmbed(
            client,
            'Information About Someone Bot',
            `whats up. I am the annoying pinger bot called Someone. To @someone, simply ping me. `
        ).addFields([
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
                value: `[Click Here!](https://discord.com/api/oauth2/authorize?client_id=${client?.user?.id}&permissions=8&scope=bot%20applications.commands)`,
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
        ]);

        return interaction.reply({ embeds: [embed] });
    },
} as SlashCommand;