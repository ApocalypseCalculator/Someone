import fs from 'fs';
import path from 'path';
import { CommandInteraction } from 'discord.js';

import { EventHandler } from '../typings/bot';
import { BotError } from '../typings/assets';
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

            return await command.execute(interaction, self);
        } catch(err) {
            try {
                const raw = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'err.json'), { encoding: 'utf-8' });
                const parsed: BotError[] = JSON.parse(raw);
                const errid = Buffer.from(`${Math.random().toString(36).substring(7)}-${Date.now()}`).toString('base64');
                const newobj: BotError = {
                    err: `${err}`,
                    id: `${errid}`,
                    time: Date.now(),
                    server: interaction.guild?.id ?? 'unknown',
                    user: interaction.user.id,
                    command: `${interaction.commandName}`,
                };

                parsed.push(newobj);
                const newraw = JSON.stringify(parsed);

                fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'err.json'), newraw);
                return interaction.reply(`Fatal error occurred, error trace id is \`${errid}\`. You can take this id to the support server for help (\`/info\` for invite).`);
            } catch(err) {
                console.log(err);
                return interaction.reply('Fatal error occurred');
            }
        }
    },
} as EventHandler;