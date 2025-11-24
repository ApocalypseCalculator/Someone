import { SlashCommand } from '../typings/bot';
import prisma from '../lib/db'
import createBaseEmbed, { createLeaderboardEmbed } from '../lib/embed';

export = {
    name: 'gleaderboard',
    description: 'A leaderboard of people who got pinged the most.',
    execute: async (interaction, client) => {
        const embed = createBaseEmbed(
            client, 
            'Global Ping Leaderboard', 
            'Top 10 @someone ping recipients globally'
        );

        let list = await prisma.user.findMany({
            orderBy: {
                pinged: 'desc'
            },
            take: 10
        });
        let total = await prisma.user.count();

        return interaction.reply({ 
            embeds: [createLeaderboardEmbed(embed, list, total)] 
        });
    },
} as SlashCommand;