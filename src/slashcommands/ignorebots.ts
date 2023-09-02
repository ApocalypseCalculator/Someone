import { SlashCommand } from '../typings/bot';
import { ApplicationCommandOptionType, ChannelType } from 'discord.js';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export = {
    name: 'ignorebots',
    description: 'Make @Someone ignore bots (or not)',
    global: true,
    options: [{
        name: 'ignore',
        type: ApplicationCommandOptionType.Boolean,
        description: 'Ignore or not',
        required: true,
    }],
    execute: async (interaction) => {
        if (!interaction.memberPermissions?.has('Administrator', true)) {
            return interaction.reply({ content: 'not authorized', ephemeral: true });
        }
        const ignore = !!(interaction.options.get('ignore', true).value);

        await prisma.guild.upsert({
            where: {
                guildid: interaction.guildId ?? ""
            },
            update: {
                ignorebots: ignore
            },
            create: {
                guildid: '1',
                ignorebots: ignore
            }
        }).catch(() => {
            return interaction.reply('Database error');
        })
        return interaction.reply(`Someone bot is set to ${ignore ? '' : 'not '}ignore other bots in this server`);
    },
} as SlashCommand;