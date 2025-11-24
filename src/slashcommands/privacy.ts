import { SlashCommand } from '../typings/bot';
import createBaseEmbed from '../lib/embed';

export = {
    name: 'privacy',
    description: 'Shows the bot\'s privacy policy.',
    execute: (interaction, client) => {
        return interaction.reply({ embeds: [
            createBaseEmbed(
                client,
                'Privacy Policy',
                PRIVACY_POLICY
            )
        ] });
    },
} as SlashCommand

const PRIVACY_POLICY = `By adding Someone Bot™️ to your server, you agree to having your Discord snowflakes collected by us and retained indefinitely. We collect this data in order to store information on how many times a user has been pinged through this bot. This privacy policy can change without notice, and we encourage you to check it regularly. If you do not agree with this policy, please promptly kick Someone Bot from your server.`;