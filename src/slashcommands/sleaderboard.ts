import { SlashCommand } from '../typings/bot';
import { throttledAllMembersFetch } from '../lib/membercache';
import prisma from '../lib/db';
import createBaseEmbed, { createLeaderboardEmbed } from '../lib/embed';

export = {
    name: 'sleaderboard',
    description: 'Shows the server leaderboard for pings.',
    global: true,
    execute: async (interaction, client) => {
        await interaction.deferReply();
        const embed = createBaseEmbed(
            client, 
            'Server Ping Leaderboard', 
            `Top 10 @someone ping recipients in \`${interaction.guild?.name}\``
        );

        const querylist = await prisma.user.findMany(
            {
                orderBy: {
                    pinged: 'desc'
                }
            }
        );
        await throttledAllMembersFetch(interaction.guild!);
        const list = querylist.filter((user) => interaction.guild?.members.cache.has(user.discordid));
        return interaction.followUp({
            embeds: [createLeaderboardEmbed(embed, list)]
        });
    },
} as SlashCommand;