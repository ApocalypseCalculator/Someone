import { ApplicationCommandOptionType, MessageFlags } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import pingSomeone from '../lib/ping';

export = {
    name: 'someone',
    description: 'Sends a message with @someone ping prepended.',
    options: [{
        name: 'message',
        description: 'The message to send.',
        type: ApplicationCommandOptionType.String,
        required: false,
    }, {
        name: 'includeself',
        description: 'Whether or not it is possible to ping yourself.',
        type: ApplicationCommandOptionType.Boolean,
        required: false,
    }],
    execute: async (interaction, client) => {
        const message = interaction.options.get('message', false)?.value ?? '';
        const includeself = !!(interaction.options.get('includeself', false)?.value);
        if (typeof message !== 'string' || message.length > 1900) {
            return interaction.reply({ content: 'invalid message argument', flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        await pingSomeone(
            client!,
            interaction.user.id,
            `<@${client?.user?.id}> ${message}`,
            interaction,
            interaction.guild!,
            async (error: string) => {
                await interaction.followUp({ content: error, flags: MessageFlags.Ephemeral });
            },
            async () => {
                await interaction.followUp({ content: "successfully sent ping", flags: MessageFlags.Ephemeral });
            },
            includeself
        );

        return;
    },
} as SlashCommand;
