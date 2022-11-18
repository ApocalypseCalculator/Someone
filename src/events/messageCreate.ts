import { Message, EmbedBuilder, ChannelType } from 'discord.js';
import { config } from '../assets/config';
import { canPing, userCount, isDisabled, getRandomUserID, addToLeaderboard, usedPing, sendWebhook } from '../assets/functions';
import { EventHandler } from '../typings/bot';
import { Someone } from '..';

export = {
    name: 'messageCreate',
    async callback(msg: Message) {
        const self = this as unknown as Someone;

        if (msg.author.id === self.user?.id || msg.author.bot || msg.channel.type === ChannelType.DM) {
            return;
        }

        if (!self.user) {
            return;
        }

        let canping = await canPing(msg.author.id);
        if (msg.mentions.members?.has(self.user.id) && !canping) {
            return msg.reply('calm down with the pings dude. (1 minute cooldown)');
        }

        if (msg.mentions.members?.has(self.user.id) && !msg.content.includes('\\<@')) {
            if (msg.content.includes('@everyone') || msg.content.includes('@here') || msg.mentions.roles.size > 0) {
                if (!msg.member?.permissions.has('MentionEveryone')) {
                    msg.channel.send('I see what you\'re doing, and I don\'t like it');
                    if (config.logging) {
                        return console.log(`Attempted ping by: ${msg.author.username}\tContent: ${msg.content}`);
                    } else {
                        return;
                    }
                } else {
                    msg.channel.send('I\'m going to give everyone 1 less ping by not repeating that with a Someone ping. tyvm');
                    if (config.logging) {
                        return console.log(`Attempted ping by: ${msg.author.username}\tContent: ${msg.content}`);
                    } else {
                        return;
                    }
                }
            } else {
                const usrcount = await userCount(msg);
                const disabled = await isDisabled(msg.channel.id);
                if (!disabled) {
                    return msg.guild?.members.fetch(self.user).then(async (member) => {
                        if (!usrcount || usrcount <= 5) {
                            return msg.channel.send('This channel has less than 5 non-bot users. To prevent spam pinging to gain rank, @someone is disabled');
                        }

                        if (msg.member?.displayName.includes('clyde')) {
                            return msg.channel.send('I\'m really sorry, but for some reason Discord doesn\'t allow the name \'clyde\' in webhooks. Would be great if you changed your nickname!');
                        }

                        if (msg.channel.type === ChannelType.GuildText && (member.permissions.has('Administrator') || (member.permissions.has('ManageWebhooks') && member.permissions.has('ManageMessages')))) {
                            try {
                                if (config.logging) {
                                    console.log(`Pinger: ${msg.author.username} (${msg.author.id})\tContent: ${msg.content.replace(`<@!${self.user?.id}>`, '(bot ping)')}`);
                                }

                                const randID = await getRandomUserID(msg);
                                await sendWebhook(msg, msg.member!, msg.content.replace(`<@!${self.user?.id}>`, `<@!${randID}>`).replace(`<@${self.user?.id}>`, `<@!${randID}>`));
                                
                                await addToLeaderboard(randID);
                                await usedPing(msg.author.id);
                                await msg.delete().catch(() => {
                                    msg.channel.send('Unable to delete message');
                                })
                                return;
                            } catch (error) {
                                console.log(error);
                                return msg.channel.send('There was an error with performing the random ping. This is usually caused by missing permissions. Please grant me either admin or manage webhook + manage messages permissions for this channel. You can contact <@492079026089885708> if this problem persists');
                            }
                        } else {
                            msg.channel.send('Insufficient permissions. Please either grant me admin or give me both manage webhooks and manage messages');
                            const embed = new EmbedBuilder()
                                .setColor(13833)
                                .setAuthor({ name: self.user?.username ?? 'Someone', iconURL: self.user?.avatarURL() ?? '' })
                                .setTitle('Permissions Demo')
                                .setImage('https://cdn.discordapp.com/attachments/711370772114833520/711620022669148180/demo3.gif')
                                .setTimestamp()
                                .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: self.user?.avatarURL() ?? '' });

                            return msg.channel.send({ embeds: [embed] });
                        }
                    }).catch(error => {
                        return console.log(error);
                    });
                } else {
                    return msg.channel.send('Channel is disabled from @someone :(');
                }
            }
        }

        if (msg.mentions.members?.has(self.user.id)) {
            msg.channel.send('I see what you are doing, and I don\'t like it');
            return console.log(`${msg.author.username}\t(failed ping)\t: ${msg.content}`);
        }
    },
} as EventHandler;