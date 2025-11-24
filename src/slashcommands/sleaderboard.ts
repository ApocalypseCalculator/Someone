import { SlashCommand } from '../typings/bot';
import { throttledAllMembersFetch } from '../lib/functions';
import prisma from '../lib/db';
import createEmbed from '../lib/embed';

export = {
    name: 'sleaderboard',
    description: 'Shows the server leaderboard for pings.',
    global: true,
    execute: async (interaction, client) => {
        await interaction.deferReply();
        const embed = createEmbed(
            client, 
            'Server Ping Leaderboard', 
            `Top 10 @someone ping recipients in ${interaction.guild?.name}`
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
        if(list.length === 0) {
            embed.setDescription('No ranked users found in this server');
            return interaction.followUp({embeds: [embed]});
        }

        for(let i = 0; i < ((list.length < 10) ? list.length : 10); i++) {
            let medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅';
            embed.addFields({ name: `#${(i + 1)}`, value: `${medal} <@!${list[i].discordid}> : ${list[i].pinged} pings` });
        }

        embed.addFields({ name: '\u200B', value: 'Out of ' + list.length + ' ranked users' });
        return interaction.followUp({embeds: [embed]});
    },
} as SlashCommand;