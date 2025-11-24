import { SlashCommand } from '../typings/bot';
import prisma from '../lib/db'
import createBaseEmbed from '../lib/embed';

export = {
    name: 'sblocked',
    description: 'Shows all blocked channels in this server.',
    global: true,
    execute: async (interaction, client) => {
        await interaction.deferReply();
        let chnllist = await prisma.channel.findMany({
            where: {
                guild: interaction.guildId ?? "-1",
                blocked: true
            }
        });

        let blocked = chnllist.map(c => `<#${c.channelid}>`).join(' ');

        if (blocked.length > 1900) {
            return interaction.followUp('Too many channels blocked in this server :(');
        } else {
            return interaction.followUp({
                embeds: [createBaseEmbed(
                    client,
                    'Blocked channels in this server',
                    (blocked === '') ? 'No blocked channels' : blocked
                )]
            });
        }
    },
} as SlashCommand;