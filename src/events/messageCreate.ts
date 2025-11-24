import { Message, ChannelType, TextChannel } from 'discord.js';
import { EventHandler } from '../typings/bot';
import { Someone } from '..';
import createBaseEmbed from '../lib/embed';

import prisma from '../lib/db'
import pingSomeone from '../lib/ping';

/*
note: the bot should not enable the Message Content gateway intent,
if the intent is off, the bot only receives gateway events for 
messages mentioning the bot, which is the desired behavior for @someone 
(unless the bot is in < 100 servers)
*/
export = {
    name: 'messageCreate',
    async callback(msg: Message) {
        const self = this as unknown as Someone;
        if (!self.user || !msg.mentions.has(self.user)) {
            return;
        }

        let curguild = await prisma.guild.findUnique({
            where: {
                guildid: msg.guildId ?? ""
            }
        });

        if (msg.author.id === self.user?.id || (curguild ? (msg.author.bot && curguild.ignorebots) : msg.author.bot) || !(msg.channel instanceof TextChannel)) {
            return;
        }

        let member = await msg.guild?.members.fetch(self.user.id);
        if (!member) return msg.channel.send('Error fetching member data.');

        if (msg.channel.type === ChannelType.GuildText && (member.permissions.has('Administrator') || (member.permissions.has('ManageWebhooks') && member.permissions.has('ManageMessages')))) {
            await pingSomeone(
                self,
                msg.author.id,
                msg.content,
                msg,
                msg.guild!,
                async (error: string) => {
                    if (msg.channel.type === ChannelType.GuildText) {
                        await msg.channel.send(error);
                    }
                    return;
                },
                async () => {
                    await msg.delete();
                }
            )
            return;
        } else {
            const embed = createBaseEmbed(
                self,
                'Insufficient Permissions',
                'Please either grant me admin or give me both manage webhooks and manage messages'
            ).setImage('https://cdn.discordapp.com/attachments/711370772114833520/711620022669148180/demo3.gif')
            // hardcoded demo gif

            return msg.channel.send({ embeds: [embed] });
        }
    },
} as EventHandler;