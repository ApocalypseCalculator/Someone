import { SlashCommand } from '../typings/bot';

export = {
    name: 'help',
    description: 'Help for this bot.',
    global: true,
    execute: (interaction) => {
        return interaction.reply('Do `/info` for my information page and `/commands` for my commands list');
    },
} as SlashCommand;