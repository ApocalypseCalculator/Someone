import { TextChannel } from 'discord.js';
import { SlashCommand } from '../typings/bot';

export = {
    name: 'whclear',
    description: 'Clears all webhooks in a guild channel.',
    global: true,
    execute: (interaction) => {
        if(!(interaction.channel instanceof TextChannel)) {
            return;
        }

        if(!interaction?.memberPermissions?.has('ManageWebhooks')) {
            return interaction.reply({ content: 'not authorized', ephemeral: true });
        }

        interaction.channel.fetchWebhooks().then((hooks) => {
            hooks.forEach((hook) => {
                hook.delete(`Webhook clearing command run by ${interaction.user.tag}`);
            });
        }).catch((error) => {
            console.log(error);
            return interaction.reply('Error on clearing webhooks. Try again or contact the bot creator in the support server if this problem persists (server invite with `/info` command)');
        });

        return interaction.reply('webhooks cleared');
    },
} as SlashCommand;