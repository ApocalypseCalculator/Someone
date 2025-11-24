import fs from 'fs';
import path from 'path';

import { config } from '../config';

import { EventHandler, SlashCommand } from '../typings/bot';
import { Someone } from '..';
import { ActivityType, ApplicationCommandDataResolvable } from 'discord.js';
import { markUncachedOnColdStart } from '../lib/membercache';

export = {
	name: 'clientReady',
	async callback() {
		const self = this as unknown as Someone;
		await markUncachedOnColdStart();

		try {
			const slash_command_files = fs.readdirSync(path.join(process.cwd(), 'src', 'slashcommands'));

			const commandlist: ApplicationCommandDataResolvable[] = [];

			for (const file of slash_command_files) {
				const command: SlashCommand = require(path.join(process.cwd(), 'src', 'slashcommands', `${file}`));

				commandlist.push({
					name: command.name,
					description: command.description,
					options: command.options,
				});

				self.slashcommands.set(command.name, command);
				console.log(`[Slash Command] ${file} loaded!`);
			}
			if (process.env.REGISTER_CMDS === "global") {
				await self.application?.commands.set(commandlist);
				console.log(`Registered slash commands to global scope.`);
			} else if (process.env.REGISTER_CMDS === "guild") {
				await self.application?.commands.set(commandlist, config.mainGuild);
				console.log(`Registered slash commands to guild scope. (Guild ID: ${config.mainGuild}, Guild Name: ${self.guilds.cache.get(config.mainGuild)?.name})`);
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