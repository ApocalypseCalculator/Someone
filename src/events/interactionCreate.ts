import { CommandInteraction } from 'discord.js';

import { EventHandler } from '../typings/bot';
import { Someone } from '..';

export = {
    name: 'interactionCreate',
    callback: async function(interaction: CommandInteraction) {
        if(!interaction.isCommand()) {
            return;
        }

        const self = this as unknown as Someone;

        try {
            const command = self.slashcommands.get(interaction.commandName);

            if(!command) {
                return;
            }

            await command.execute(interaction, self);
        } catch(err) {
            console.log((err as Error).stack);
        }
    },
} as EventHandler;