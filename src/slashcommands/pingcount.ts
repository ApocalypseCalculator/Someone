import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import prisma from '../lib/db'
import createBaseEmbed from '../lib/embed';

export = {
    name: 'pingcount',
    description: 'Shows number of pings received for a user.',
    global: true,
    options: [{
        name: 'user',
        description: 'The user to check.',
        type: ApplicationCommandOptionType.User,
        required: true,
    }],
    execute: async (interaction, client) => {
        await interaction.deferReply();
        const embed = createBaseEmbed(
            client,
            `Ping Count`,
            `<@!${interaction.options.getUser('user', true).id}> has 0 received pings through @someone`
        );

        let usr = await prisma.user.findUnique({
            where: {
                discordid: interaction.options.getUser('user', true).id
            }
        })

        if (usr) {
            embed.setDescription(`<@!${interaction.options.getUser('user', true).id}> has ${usr.pinged} received ping${(usr.pinged == 1) ? '' : 's'} through @someone`);
        }
        return interaction.followUp({ embeds: [embed] });
    },
} as SlashCommand;