import { SlashCommand } from '../typings/bot';
import { config } from '../config';
import { ApplicationCommandOptionType, MessageFlags } from 'discord.js';
import prisma from '../lib/db'

export = {
    name: 'errtrace',
    description: 'Shows details about an error trace.',
    global: true,
    options: [{
        name: 'id',
        description: 'The ID of the error trace.',
        type: ApplicationCommandOptionType.String,
        required: true,
    }],
    execute: async (interaction) => {
        if (config.hostID !== interaction.user.id) {
            return interaction.reply({ content: 'not authorized', flags: MessageFlags.Ephemeral });
        }

        const errid = interaction.options.get('id', true).value;

        let err = await prisma.error.findUnique({
            where: {
                errid: errid as string
            }
        })
        if (!err) {
            return interaction.reply('No error with ID found.');
        } else {
            return interaction.reply(`\`\`\`Error: ${err.error}\nID: ${err.errid}\nTime: ${new Date(err.time).toUTCString()}\nServer: ${err.guild}\nChannel: ${err.channelid}\nUser: ${err.discordid}\nCommand: ${err.command}\`\`\``);
        }
    },
} as SlashCommand;