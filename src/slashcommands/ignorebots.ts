import { SlashCommand } from '../typings/bot';
import { ApplicationCommandOptionType, MessageFlags } from 'discord.js';
import prisma from '../lib/db'

export = {
    name: 'ignorebots',
    description: 'Make @someone ignore bots (or not)',
    global: true,
    options: [{
        name: 'ignore',
        type: ApplicationCommandOptionType.Boolean,
        description: 'Ignore or not',
        required: true,
    }],
    execute: async (interaction) => {
        if (!interaction.memberPermissions?.has('Administrator', true)) {
            return interaction.reply({ content: 'not authorized', flags: MessageFlags.Ephemeral });
        }
        await interaction.deferReply();
        const ignore = !!(interaction.options.get('ignore', true).value);

        await prisma.guild.upsert({
            where: {
                guildid: interaction.guildId!
            },
            update: {
                ignorebots: ignore
            },
            create: {
                guildid: interaction.guildId!,
                ignorebots: ignore
            }
        });
        return interaction.followUp(`Someone bot is set to ${ignore ? '' : 'not '}ignore other bots in this server`);
    },
} as SlashCommand;