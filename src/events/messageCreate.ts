import fs from 'fs';
import { Message, TextChannel, MessageEmbed, ClientUser } from 'discord.js';
import { config } from '../assets/config';
import { canPing, userCount, isDisabled, getRandomUserID, addToLeaderboard, usedPing } from '../assets/functions';
import { EventHandler } from '../typings/bot';
import { BotError } from '../typings/assets';
import { Someone } from '..';

export = {
    name: 'messageCreate',
    callback: async (msg: Message) => {
        const self = this as unknown as Someone;

        const args = msg.content.slice(config.prefix.length).trim().split(' ');
        const command = args.shift()?.toLowerCase();

        if(msg.author.id === self.user?.id || msg.author.bot || msg.channel.type === 'DM') {
            return;
        } else if(msg.mentions.members?.has(self.user?.id as string) && !canPing(msg.author.id)) {
            msg.reply('calm down with the pings dude. (1 minute cooldown)');
        } else if(msg.mentions.members?.has(self.user?.id as string) && !msg.content.includes('\\<@')) {
            if(msg.content.includes('@everyone') || msg.content.includes('@here') || msg.mentions.roles.size > 0) {
                if(!msg.member?.permissions.has('MENTION_EVERYONE')) {
                    msg.channel.send('I see what you\'re doing, and I don\'t like it');
                    if(config.logging) {
                        console.log(`Attempted ping by: ${msg.author.username}\tContent: ${msg.content}`);
                    }
                } else {
                    msg.channel.send('I\'m going to give everyone 1 less ping by not repeating that with a Someone ping. tyvm');
                    if(config.logging) {
                        console.log(`Attempted ping by: ${msg.author.username}\tContent: ${msg.content}`);
                    }
                }
            } else {
                const usrcount = await userCount(msg);
                if(!isDisabled(msg.channel.id)) {
                    msg.guild?.members.fetch(self.user as ClientUser).then((member) => {
                        if(!usrcount || usrcount <= 5) {
                            msg.channel.send('This channel has less than 5 non-bot users. To prevent spam pinging to gain rank, @someone is disabled');
                        } else if(msg.member?.displayName.includes('clyde')) {
                            msg.channel.send('I\'m really sorry, but for some reason Discord doesn\'t allow the name \'clyde\' in webhooks. Would be great if you changed your nickname!');
                        } else if(member.permissions.has('ADMINISTRATOR') || (member.permissions.has('MANAGE_WEBHOOKS') && member.permissions.has('MANAGE_MESSAGES'))) {
                            (msg.channel as TextChannel).createWebhook(msg.member?.displayName as string, {
                                avatar: msg.author.avatarURL() || 'https://cdn.discordapp.com/attachments/793653928159608843/882819198907215892/upload.jpg',
                                reason: `Random someone ping requested by ${msg.author.tag} (${msg.author.id})`,
                            }).then(webhook => {
                                if(config.logging) {
                                    console.log(`Pinger: ${msg.author.username} (${msg.author.id})\tContent: ${msg.content.replace(`<@!${self.user?.id}>`, '(bot ping)')}`);
                                }

                                const randID = getRandomUserID(msg);

                                if(msg.content.includes(`<@!${self.user?.id}>`)) {
                                    webhook.send(msg.content.replace(`<@!${self.user?.id}>`, `<@!${randID}>`));
                                } else {
                                    webhook.send(msg.content.replace(`<@${self.user?.id}>`, `<@!${randID}>`));
                                }

                                addToLeaderboard(randID);

                                msg.delete();

                                usedPing(msg.author.id);

                                setTimeout(() => {
                                    webhook.delete();
                                }, 1000);
                            }).catch(error => {
                                console.log(error);
                                msg.channel.send('There was an error with performing the random ping. This is usually caused by missing permissions. Please grant me either admin or manage webhook + manage messages permissions for this channel. You can contact <@492079026089885708> if this problem persists');
                            });
                        } else {
                            msg.channel.send('Insufficient permissions. Please either grant me admin or give me both manage webhooks and manage messages');
                            const embed = new MessageEmbed()
                                .setColor(13833)
                                .setAuthor((self.user as ClientUser).username, (self.user as ClientUser).avatarURL() as string)
                                .setTitle('Permissions Demo')
                                .setImage('https://cdn.discordapp.com/attachments/711370772114833520/711620022669148180/demo3.gif')
                                .setTimestamp()
                                .setFooter('Someone Bot By ApocalypseCalculator - Licensed', (self.user as ClientUser).avatarURL() as string);

                            msg.channel.send({ embeds: [embed] });
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    msg.channel.send('Channel is disabled from @someone :(');
                }
            }
        } else if(msg.mentions.members?.has(self.user?.id as string)) {
            msg.channel.send('I see what you are doing, and I don\'t like it');
            console.log(`${msg.author.username}\t(failed ping)\t: ${msg.content}`);
        } else if(!msg.content.startsWith(config.prefix)) {
            return;
        } else if(!self.commands.get(command as string)) {
            msg.channel.send('command not found');
        } else if(self.commands.get(command as string)?.verify(msg)) {
            try {
                self.commands.get(command as string)?.execute(msg, args, self);
            } catch(err) {
                try {
                    const raw = fs.readFileSync('../data/err.json', { encoding: 'utf-8' });
                    const parsed: BotError[] = JSON.parse(raw);
                    const errid = Buffer.from(`${Math.random().toString(36).substring(7)}-${Date.now()}`).toString('base64');
                    const newobj: BotError = {
                        err: `${err}`,
                        id: `${errid}`,
                        time: Date.now(),
                        server: msg.guild!.id,
                        user: msg.author.id,
                        command: `${msg.content}`,
                    };

                    parsed.push(newobj);
                    const newraw = JSON.stringify(parsed);

                    fs.writeFileSync('../data/err.json', newraw);
                    msg.channel.send(`Fatal error occurred, error trace id is \`${errid}\`. You can take this id to the support server for help (\`${config.prefix}info\` for invite).`);
                } catch(err) {
                    console.log(err);
                    msg.channel.send('Fatal error occurred');
                }
            }
        } else {
            msg.channel.send('You do not have permission to use this command');
        }
    },
} as EventHandler;