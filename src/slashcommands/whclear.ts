import { TextChannel, MessageFlags, WebhookClient } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import prisma from '../lib/db';

export = {
    name: 'whclear',
    description: 'Clears all webhooks managed by Someone bot in the current server.',
    global: true,
    execute: async (interaction) => {
        if (!(interaction.channel instanceof TextChannel)) {
            return interaction.reply({ content: 'not a text channel', flags: MessageFlags.Ephemeral });
        }

        if (!interaction.memberPermissions || !interaction.memberPermissions.has('ManageWebhooks')) {
            return interaction.reply({ content: 'you do not have manage webhooks permission in this server', flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply();
        let channels = await prisma.channel.findMany({
            where: {
                guild: interaction.guildId ?? "-1",
            }
        })
        if (!channels || channels.filter(ch => ch.webhook).length === 0) {
            return interaction.followUp({ content: 'No webhooks managed by Someone bot found in this server.' });
        }
        let targets = channels.filter(ch => ch.webhook);
        try {
            // wait until all webhooks cleared
            await Promise.all(targets.map(ch => {
                let wh;
                try {
                    wh = new WebhookClient({
                        url: ch.webhook ?? ""
                    })
                }
                catch {
                    // invalid webhook url, skip
                    return true;
                }
                return wh.delete(`Webhook clearing command run by ${interaction.user.tag}`);
            }));
            await prisma.channel.updateMany({
                where: {
                    guild: interaction.guildId ?? "-1",
                    webhook: {
                        not: null
                    }
                },
                data: {
                    webhook: null
                }
            });
        }
        catch {
            return interaction.followUp('Error on clearing webhooks. Try again or contact the bot creator if this problem persists');
        }

        return interaction.followUp(`Successfully cleared ${targets.length} webhooks`);
    },
} as SlashCommand;