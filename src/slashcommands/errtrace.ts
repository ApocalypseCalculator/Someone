import { SlashCommand } from '../typings/bot';
import { config } from '../assets/config';
import { ApplicationCommandOptionType } from 'discord.js';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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
            return interaction.reply({ content: 'not authorized', ephemeral: true });
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