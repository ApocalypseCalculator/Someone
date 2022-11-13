import { CommandInteraction } from 'discord.js';

import { EventHandler } from '../typings/bot';
import { Someone } from '..';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export = {
    name: 'interactionCreate',
    callback: async function (interaction: CommandInteraction) {
        if (!interaction.isCommand()) {
            return;
        }
        if (!interaction.guild) {
            return interaction.reply('Commands in DMs are disabled');
        }

        const self = this as unknown as Someone;

        try {
            const command = self.slashcommands.get(interaction.commandName);

            if (!command) {
                return;
            }

            return await command.execute(interaction, self);
        } catch (err) {
            try {
                const errid = Buffer.from(`${Math.random().toString(36).substring(7)}-${Date.now()}`).toString('base64');
                await prisma.error.create({
                    data: {
                        errid: errid,
                        error: `${err}`,
                        time: Date.now(),
                        guild: interaction.guild?.id ?? 'unknown',
                        channelid: interaction.channel?.id ?? 'unknown',
                        discordid: interaction.user.id,
                        command: `${interaction.commandName}`
                    }
                });
                return interaction.reply(`Fatal error occurred, error trace id is \`${errid}\`. You can take this id to the support server for help (\`/info\` for invite).`);
            } catch (err) {
                console.log(err);
                return interaction.reply('Fatal error occurred');
            }
        }
    },
} as EventHandler;