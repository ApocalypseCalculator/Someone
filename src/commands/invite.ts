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
            .setAuthor(client!.user!.username, client!.user!.avatarURL() as string)
            .setTitle('Invite Me To Your Server!')
            .addField('Invite Link', '[Click Me!](https://discord.com/api/oauth2/authorize?client_id=705135432588853288&permissions=8&scope=bot%20applications.commands)')
            .setTimestamp()
            .setFooter('Someone Bot By ApocalypseCalculator - Licensed', client!.user!.avatarURL() as string);

        return msg.reply({ embeds: [embed] });
    },
} as Command;