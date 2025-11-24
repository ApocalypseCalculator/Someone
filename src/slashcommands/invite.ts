import { SlashCommand } from '../typings/bot';
import createBaseEmbed from '../lib/embed';

export = {
    name: 'invite',
    description: 'How to invite the bot.',
    global: true,
    execute: (interaction, client) => {
        return interaction.reply({
            embeds: [createBaseEmbed(
                client,
                'Invite Me To Your Server!',
                `[Click Me!](https://discord.com/api/oauth2/authorize?client_id=${client?.user?.id}&permissions=8&scope=bot%20applications.commands)`
            )]
        });
    },
} as SlashCommand;