import { GuildMember, Message, TextChannel } from 'discord.js';
import { config } from '../assets/config';
import { getRandomUserID } from '../assets/functions';
import { SlashCommand } from '../typings/bot';

export = {
    name: 'fake',
    description: 'Sends a fake message.',
    global: true,
    options: [{
        name: 'message',
        description: 'The message to send.',
        type: 'STRING',
        required: true,
    }],
    execute: async (interaction) => {
        if(/@everyone/.test(interaction.options.getString('message', true)) || /<@!?&[0,9]{18}>/.test(interaction.options.getString('message', true))) {
            return interaction.reply('Ahem I will not ping in a fake message');
        } else if(interaction.options.getString('message', true).split(' ').length <= 1) {
            return interaction.reply('Yo you need to give me a message');
        } else {
            const targetmsg = interaction.options.getString('message', true).slice(`${config.prefix}fake`.length);
            const fakemember = await getRandomUserID(interaction);
            const faker = interaction.guild?.members.cache.get(fakemember);

            try {
                const webhook = await (interaction.channel as TextChannel).createWebhook((faker as GuildMember)?.displayName ?? 'No name', {
                    avatar: (faker as GuildMember)?.user.avatarURL() as string,
                    reason: `Fake message requested by ${interaction.user.tag} (${interaction.user.id})`,
                });

                // interaction.deleteReply(); NOTE: add if some sort of visible reply is present after invocation

                webhook.send(targetmsg).then((message) => {
                    console.log(`fake message for ${(faker as GuildMember)?.id} created by ${interaction.user.id}. Link suffix is ${(message as Message).url.slice('https://discordapp.com/channels/'.length)}`);
                });

                return setTimeout(() => {
                    return webhook.delete();
                }, 1000);
            } catch(error) {
                console.log(error);
                return interaction.reply(`There was an error with making the fake message. This is usually caused by missing permissions. Please grant me either admin or manage webhook + manage messages permissions for this channel. You can contact ApocalypseCalculator <@${config.creatorID}> if this problem persists`);
            }
        }
    },
} as SlashCommand;