import { ApplicationCommandOptionType, TextChannel, MessageFlags } from 'discord.js';
import { getRandomUserID, sendWebhook } from '../lib/functions';
import { SlashCommand } from '../typings/bot';

export = {
    name: 'fake',
    description: 'Sends a fake message.',
    options: [{
        name: 'message',
        description: 'The message to send.',
        type: ApplicationCommandOptionType.String,
        required: true,
    }],
    execute: async (interaction) => {
        const message = interaction.options.get('message', true).value;
        if (typeof message !== 'string') {
            return interaction.reply('invalid message argument');
        }

        if (hasPing(message)) {
            return interaction.reply('I cannot ping in a fake message');
        } else {
            await interaction.deferReply();

            const {id: fakemember} = await getRandomUserID(interaction);
            const faker = interaction.guild?.members.cache.get(fakemember);

            try {
                if (!(interaction.channel instanceof TextChannel) || !faker) {
                    return interaction.followUp('Incorrect channel or invalid cache. Try again later.');
                }

                let success = await sendWebhook(interaction, faker, message)

                if (success) {
                    return interaction.followUp({ content: 'Your fake message was sent!', flags: MessageFlags.Ephemeral });
                }
                else {
                    return interaction.followUp(`There was an error making the fake message. This may be due to missing create webhook permissions.`);
                }
            } catch (error) {
                console.log(error);
                return interaction.reply(`There was an error with making the fake message. This is usually caused by missing permissions. Please grant me either admin or manage webhook permissions for this channel.`);
            }
        }
    },
} as SlashCommand;

function hasPing(content: string) {
    // good regex trust
    return /<@!?&?\d{17,22}>/.test(content) || /@everyone/.test(content) || /@here/.test(content);
}
