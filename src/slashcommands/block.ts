import { SlashCommand } from '../typings/bot';
import { ApplicationCommandOptionType } from 'discord.js';
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
    execute: (interaction) => {
        if (!interaction.memberPermissions?.has('Administrator', true)) {
            return interaction.reply({ content: 'not authorized', ephemeral: true });
        }

        const channel = interaction.options.get('channel', true).channel;
        if (channel) {
            prisma.channel.findUnique({
                where: {
                    channelid: channel.id
                }
            }).then((chnldata) => {
                if (chnldata) {
                    prisma.channel.update({
                        where: {
                            channelid: channel.id
                        },
                        data: {
                            blocked: !chnldata.blocked
                        }
                    }).then(() => {
                        return interaction.reply(`Channel ${chnldata.blocked ? "re-enabled" : "disabled"} for @someone pings`);
                    }).catch(() => {
                        return interaction.reply(`Error occurred`);
                    });
                }
                else {
                    prisma.channel.create({
                        data: {
                            channelid: channel.id,
                            guild: interaction.guildId ?? "",
                            blocked: false
                        }
                    }).then(() => {
                        return interaction.reply(`Channel disabled for @someone pings`);
                    }).catch(() => {
                        return interaction.reply(`Error occurred`);
                    });
                }
            }).catch(() => {
                return interaction.reply(`Error occurred`);
            });
        } else {
            return interaction.reply('Please mention a channel to disable/re-enable.');
        }
    },
} as SlashCommand;