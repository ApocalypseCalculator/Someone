import fs from 'fs';
import path from 'path';

import { config } from '../config';

import { EventHandler, SlashCommand } from '../typings/bot';
import { Someone } from '..';
import { ActivityType } from 'discord.js';
import { markUncachedOnColdStart } from '../lib/membercache';

export = {
	name: 'clientReady',
	async callback() {
		const self = this as unknown as Someone;

		if (process.env.REGISTER_CMDS === "unregister") {
			await self.application?.commands.set([]);
			await self.guilds.cache.get(config.mainGuild)?.commands.set([]);
			console.log('Unregistered all slash commands.');
			process.exit(0);
		}

		await markUncachedOnColdStart();

		try {
			const slash_command_files = fs.readdirSync(path.join(process.cwd(), 'src', 'slashcommands'));

			// todo: non-blocking command loading
			for (const file of slash_command_files) {
				const command: SlashCommand = require(path.join(process.cwd(), 'src', 'slashcommands', `${file}`));

				if (process.env.REGISTER_CMDS === "global") {
					const data = {
						name: command.name,
						description: command.description,
						options: command.options,
					};

					await self.application?.commands.create(data);
				} else if (process.env.REGISTER_CMDS === "guild") {
					const data = {
						name: command.name,
						description: command.description,
						options: command.options,
					};

					await self.guilds.cache.get(config.mainGuild)?.commands.create(data);
				}

				self.slashcommands.set(command.name, command);
				console.log(`[Slash Command] ${file} loaded!`);
			}
			if (['global', 'guild'].includes(process.env.REGISTER_CMDS || '')) {
				console.log(`Registered slash commands to ${process.env.REGISTER_CMDS} scope.`);
			}
		} catch (error) {
			console.log((error as Error).stack);
		}

		console.log('Connected to Discord!');

		self.user?.setPresence({
			activities: [{
				type: ActivityType.Watching,
				name: '/help for help',
			}],
			status: 'online',
		});
	},
} as EventHandler;