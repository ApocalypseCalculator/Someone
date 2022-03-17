import { MessageEmbed } from 'discord.js';
import { Command } from '../typings/bot';

export = {
    name: 'privacy',
    verify: () => {
        return true;
    },
    execute: (msg, _args, client) => {
        const embed = new MessageEmbed()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .setTitle('Privacy Policy')
            .addField('\u200B', '\u200B')
            .addField('Privacy Policy of Someone bot', 'By adding Someone Bot™️ to your server, you agree to having your Discord snowflakes collected by us and retained indefinitely. We collect this data in order to store information on how many times a user has been pinged through this bot. This privacy policy can change without notice, and we encourage you to check it regularly. If you do not agree with this policy, please promptly kick Someone Bot from your server.')
            .addField('\u200B', '\u200B')
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        return msg.reply({ embeds: [embed] });
    },
} as Command