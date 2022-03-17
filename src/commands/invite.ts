import { Command } from '../typings/bot';
import { MessageEmbed } from 'discord.js';

export = {
    name: 'invite',
    verify: () => {
        return true;
    },
    execute: (msg, _args, client) => {
        const embed = new MessageEmbed()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .setTitle('Invite Me To Your Server!')
            .addField('Invite Link', '[Click Me!](https://discord.com/api/oauth2/authorize?client_id=705135432588853288&permissions=8&scope=bot%20applications.commands)')
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        return msg.reply({ embeds: [embed] });
    },
} as Command;