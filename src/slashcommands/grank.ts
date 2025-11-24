import { SlashCommand } from '../typings/bot';
import { ApplicationCommandOptionType } from 'discord.js';
import prisma from '../lib/db'
import createBaseEmbed from '../lib/embed';

export = {
    name: 'grank',
    description: 'Shows a user\'s global ping rank.',
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
            'Global Ping Rank',
            ''
        )

        let user = await prisma.user.findUnique({
            where: {
                discordid: interaction.options.getUser('user', true).id
            }
        })
        if (!user) {
            embed.setDescription(`<@!${interaction.options.getUser('user', true).id}> is not ranked`);
        }
        else {
            let rank = await prisma.user.count({
                where: {
                    pinged: {
                        gt: user.pinged
                    }
                }
            }) + 1;
            embed.setDescription(`<@!${interaction.options.getUser('user', true).id}> is ranked **#${rank}** globally for pings received`);
        }
        return interaction.followUp({ embeds: [embed] });
    },
} as SlashCommand;