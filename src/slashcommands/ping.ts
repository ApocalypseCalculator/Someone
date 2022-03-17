import { SlashCommand } from '../typings/bot';

export = {
    name: 'ping',
    description: 'Shows the bot\'s latency',
    global: true,
    execute: async (interaction, client) => {
        return interaction.reply('poooong').then(() => {
            return interaction.editReply(`Pong! API Latency is ${Math.round(client?.ws.ping ?? 50)}ms`);
        });
    },
} as SlashCommand;