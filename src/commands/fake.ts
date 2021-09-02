import { GuildMember, Message, TextChannel } from 'discord.js';
import { config } from '../assets/config';
import { getRandomUserID } from '../assets/functions';
import { Command } from '../typings/bot';

export = {
    name: 'fake',
    verify: () => {
        return true;
    },
    execute: async (msg) => {
        if(msg.mentions.users.size > 0 || msg.mentions.roles.size > 0 || msg.mentions.everyone || /@everyone/.test(msg.content) || /<@!?&[0,9]{18}>/.test(msg.content)) {
            return msg.reply('Ahem I will not ping in a fake message');
        } else if(msg.content.split(' ').length <= 1) {
            return msg.reply('Yo you need to give me a message');
        } else {
            const targetmsg = msg.content.slice(`${config.prefix}fake`.length);
            const fakemember = getRandomUserID(msg);
            const faker = msg.guild!.members.cache.get(fakemember);

            try {
                const webhook = await (msg.channel as TextChannel).createWebhook((faker as GuildMember).displayName, {
                    avatar: (faker as GuildMember).user.avatarURL() as string,
                    reason: `Fake message requested by ${msg.author.tag} (${msg.author.id})`,
                });

                msg.delete();

                webhook.send(targetmsg).then((message) => {
                    console.log(`fake message for ${(faker as GuildMember).id} created by ${msg.author.id}. Link suffix is ${(message as Message).url.slice('https://discordapp.com/channels/'.length)}`);
                });

                return setTimeout(() => {
                    return webhook.delete();
                }, 1000);
            } catch(error) {
                console.log(error);
                return msg.channel.send(`There was an error with making the fake message. This is usually caused by missing permissions. Please grant me either admin or manage webhook + manage messages permissions for this channel. You can contact ApocalypseCalculator <@${config.creatorID}> if this problem persists`);
            }
        }
    },
} as Command;