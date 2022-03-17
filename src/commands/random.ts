import { MessageEmbed } from 'discord.js';
import { Command } from '../typings/bot';

export = {
    name: 'random',
    verify: () => {
        return true;
    },
    execute: (msg, args, client) => {
        if(!args || isNaN(parseInt(args[0]))) {
            return msg.reply('Invalid arguments');
        } else {
            const members: string[] = [];

            return msg.guild?.members.fetch().then((memberz) => {
                memberz.forEach((member, key) => {
                    if(!member.user.bot) {
                        members.push(key);
                    }
                });

                if(members.length <= parseInt(args[0])) {
                    return msg.reply(`Too little members in this server to pick ${args[0]} random members`);
                } else if(parseInt(args[0]) <= 0) {
                    return msg.reply('Please provide a valid number > 0');
                } else {
                    let list = '';
                    for(let i = 0; i < parseInt(args[0]); i++) {
                        const randomNum = Math.round((members.length - 1) * Math.random());
                        list += `<@${members[randomNum]}> `;
                        members.splice(randomNum, 1);
                    }

                    if(list.length >= 1990) {
                        return msg.reply('Your member list is wayyyy too long. Try a smaller number maybe?');
                    } else {
                        const embed = new MessageEmbed()
                            .setColor(13833)
                            .addField(`Here ${(parseInt(args[0]) == 1 ? 'is' : 'are')} your ${args[0]} random member${(parseInt(args[0]) == 1) ? '' : 's'}`, list)
                            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

                        return msg.reply({ embeds: [embed] });
                    }
                }
            }).catch((err) => {
                console.log(err);
                return msg.reply('API request failed');
            });
        }
    },
} as Command;