import { SlashCommand } from '../typings/bot';
import { ApplicationCommandOptionType, ChannelType } from 'discord.js';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export = {
    name: 'block',
    description: 'Blocks a channel from using the bot.',
    global: true,
    options: [{
        name: 'channel',
        type: ApplicationCommandOptionType.Channel,
        description: 'Which channel to block from using the bot.',
        required: true,
    }],
    execute: async (interaction) => {
        if (!interaction.memberPermissions?.has('Administrator', true)) {
            return interaction.reply({ content: 'not authorized', ephemeral: true });
        }

        const channel = interaction.options.get('channel', true).channel;
        if (channel) {
            if (channel.type !== ChannelType.GuildText && channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.PrivateThread && channel.type !== ChannelType.PublicThread) {
                return interaction.reply(`Invalid channel`);
            }
            let chnldata = await prisma.channel.findUnique({
                where: {
                    channelid: channel.id
                }
            });
            if (chnldata) {
                await prisma.channel.update({
                    where: {
                        channelid: channel.id
                    },
                    data: {
                        blocked: !chnldata.blocked
                    }
                });
                return interaction.reply(`Channel ${chnldata!.blocked ? "re-enabled" : "disabled"} for @someone pings`);
            }
            else {
                await prisma.channel.create({
                    data: {
                        channelid: channel.id,
                        guild: interaction.guildId ?? "",
                        blocked: false
                    }
                });
                return interaction.reply(`Channel disabled for @someone pings`);
            }
        } else {
            return interaction.reply('Please mention a channel to disable/re-enable.');
        }
    },
} as SlashCommand;