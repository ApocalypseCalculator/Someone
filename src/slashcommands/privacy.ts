import { EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../typings/bot';

export = {
    name: 'privacy',
    description: 'Shows the bot\'s privacy policy.',
    global: true,
    execute: (interaction, client) => {
        const embed = new EmbedBuilder()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .setTitle('Privacy Policy')
            .addFields([
                {
                    name: '\u200B',
                    value: '\u200B',
                },
                {
                    name: 'Privacy Policy of Someone bot',
                    value: 'By adding Someone Bot™️ to your server, you agree to having your Discord snowflakes collected by us and retained indefinitely. We collect this data in order to store information on how many times a user has been pinged through this bot. This privacy policy can change without notice, and we encourage you to check it regularly. If you do not agree with this policy, please promptly kick Someone Bot from your server.',
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
} as SlashCommand