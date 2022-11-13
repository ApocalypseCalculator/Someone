import { ApplicationCommandOptionType, TextChannel } from 'discord.js';
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
        type: ApplicationCommandOptionType.String,
        required: true,
    }],
    execute: async (interaction) => {
        const message = interaction.options.get('message', true).value;
        if(typeof message !== 'string') {
            return;
        }

        if(/@everyone/.test(message) || /<@!?&[0,9]{18}>/.test(message)) {
            return interaction.reply('Ahem I will not ping in a fake message');
        } else {
            const fakemember = await getRandomUserID(interaction);
            const faker = interaction.guild?.members.cache.get(fakemember);

            try {
                if(!(interaction.channel instanceof TextChannel) || !faker) {
                    return;
                }

                const webhook = await interaction.channel.createWebhook({
                    name: faker.displayName,
                    avatar: faker.user.avatarURL(),
                    reason: `Fake message requested by ${interaction.user.tag} (${interaction.user.id})`,
                });

                webhook.send(message).then((msg) => {
                    console.log(`fake message for ${faker.id} created by ${interaction.user.id}. Link suffix is ${msg.url.slice('https://discordapp.com/channels/'.length)}`);
                });

                setTimeout(() => {
                    return webhook.delete();
                }, 1000);

                return interaction.reply({ content: 'Your fake message was sent!', ephemeral: true });
            } catch(error) {
                console.log(error);
                return interaction.reply(`There was an error with making the fake message. This is usually caused by missing permissions. Please grant me either admin or manage webhook + manage messages permissions for this channel. You can contact ApocalypseCalculator <@${config.creatorID}> if this problem persists`);
            }
        }
    },
} as SlashCommand;