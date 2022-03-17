import fs from 'fs';
import path from 'path';

import { EventHandler, SlashCommand } from '../typings/bot';
import { config } from '../assets/config';
import { Someone } from '..';

export = {
    name: 'ready',
    async callback() {
        const self = this as unknown as Someone;
        const guild_id = '724624373369012231'; // CHANGE WHEN MERGING INTO PROD BOT

		try {
			const slash_command_files = fs.readdirSync(path.join(process.cwd(), 'src', 'commands', 'slashCommands')).filter((file) => file.endsWith('.ts'));

			for(const file of slash_command_files) {
				const command: SlashCommand = require(path.join(process.cwd(), 'src', 'commands', 'slashCommands', `${file}`));

				if(command.global === true) {
					const data = {
						name: command.name,
						description: command.description,
						options: command.options,
					};

					await self.application?.commands.create(data);
				} else {
					const data = {
						name: command.name,
						description: command.description,
						options: command.options,
					};

					await self.guilds.cache.get(guild_id)?.commands.create(data);
				}

				self.slashcommands.set(command.name, command);
				console.log(`[Slash Command] ${file} loaded! (${command.global ? 'Global' : 'Guild-only'})`);
			}
		} catch(error) {
			console.log((error as Error).stack);
		}

        console.log('Connected to Discord!');

        self.user?.setPresence({
            activities: [{
                type: 'WATCHING',
                name: ` for ${config.prefix}help`,
            }],
            status: 'online',
        });
    },
} as EventHandler;