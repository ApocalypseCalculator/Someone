import { SlashCommand } from '../typings/bot';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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
        const embed = new EmbedBuilder()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .setTitle('Global Ping Leaderboard Rank Information')
            .setDescription('Shows your global rank / someone else\'s rank')
            .addFields({ name: '\u200B', value: '\u200B' })
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        let user = await prisma.user.findUnique({
            where: {
                discordid: interaction.options.getUser('user', true).id
            }
        })
        if (!user) {
            embed.addFields({ name: 'Ping Count', value: `<@!${interaction.options.getUser('user', true).id}> is not ranked` });
            embed.addFields({ name: '\u200B', value: '\u200B' });
            return interaction.reply({ embeds: [embed] });
        }
        let lgtlist = await prisma.user.findMany({
            where: {
                pinged: {
                    gt: user?.pinged
                }
            }
        });
        embed.addFields({ name: 'Ping Count', value: `<@!${interaction.options.getUser('user', true).id}> is ranked **#${lgtlist.length + 1}** globally for pings received` });
        embed.addFields({ name: '\u200B', value: '\u200B' });

        return interaction.reply({ embeds: [embed] });
    },
} as SlashCommand;