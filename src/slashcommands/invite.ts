import { SlashCommand } from '../typings/bot';
import { EmbedBuilder } from 'discord.js';

export = {
    name: 'invite',
    description: 'How to invite the bot.',
    global: true,
    execute: (interaction, client) => {
        const embed = new EmbedBuilder()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .setTitle('Invite Me To Your Server!')
            .addFields({ name: 'Invite Link', value: '[Click Me!](https://discord.com/api/oauth2/authorize?client_id=705135432588853288&permissions=8&scope=bot%20applications.commands)' })
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        return interaction.reply({ embeds: [embed] });
    },
} as SlashCommand;