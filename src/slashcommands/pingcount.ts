import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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
        const embed = new EmbedBuilder()
            .setColor(13833)
            .setAuthor({ name: client?.user?.username ?? '', iconURL: client?.user?.avatarURL() ?? '' })
            .addFields({ name: '\u200B', value: '\u200B' })
            .setTimestamp()
            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

        embed.setTitle(`Recorded Pings Received By ${interaction.options.getUser('user', true).username}`);

        let usr = await prisma.user.findUnique({
            where: {
                discordid: interaction.options.getUser('user', true).id
            }
        })

        if (!usr) {
            embed.addFields({ name: 'Ping Count', value: `<@!${interaction.options.getUser('user', true).id}> has 0 received pings through this bot` });
            embed.addFields({ name: '\u200B', value: '\u200B' });
            return interaction.reply({ embeds: [embed] });
        }
        else {
            embed.addFields({ name: 'Ping Count', value: `<@!${interaction.options.getUser('user', true).id}> has ${usr.pinged} received ping${(usr.pinged == 1) ? '' : 's'} through this bot` });
            embed.addFields({ name: '\u200B', value: '\u200B' });
            return interaction.reply({ embeds: [embed] });
        }
    },
} as SlashCommand;