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

        const channel = interaction.options.getChannel('channel', true);
        if (!channel) {
            return interaction.reply('Please mention a channel to disable/re-enable.');
        }

        if(! [ChannelType.GuildText, ChannelType.GuildForum, ChannelType.PrivateThread, ChannelType.PublicThread].includes(channel.type)) {
            return interaction.reply(`Invalid channel`);
        }
        let chnldata = await prisma.channel.findUnique({
            where: {
                channelid: channel.id
            }
        });
        let resultchannel = await prisma.channel.upsert({
            where: {
                channelid: channel.id
            },
            update: {
                blocked: chnldata ? !chnldata.blocked : true
            },
            create: {
                channelid: channel.id,
                guild: interaction.guildId!,
                blocked: true
            }
        })

        return interaction.reply(`Channel ${resultchannel.blocked ? "disabled" : "re-enabled"} for @someone pings`);
    },
} as SlashCommand;