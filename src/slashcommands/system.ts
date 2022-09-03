import { EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import { config } from '../assets/config';
import { formatTime } from '../assets/functions';
import system from 'systeminformation';

export = {
    name: 'system',
    description: 'Checks the bot\'s host system info.',
    global: true,
    execute: async (interaction) => {
        if(config.hostID !== interaction.user.id) {
            return interaction.reply({ content: 'not authorized', ephemeral: true });
        }

        try {
            const embed = new EmbedBuilder()
                .setTitle('System Stats')
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() ?? '' })
                .setColor('Green');

            try {
                return await system.osInfo((os) => {
                    system.processes((processes) => {
                        embed.addFields({ name: 'Basic Information', value: `Uptime: ${formatTime(Number(system.time().uptime))}\nTimezone: ${system.time().timezone}\nOperating System: ${os.distro} ${os.release} ${os.arch}\nCurrent Processes: ${processes.list.length}`, inline: true });

                        system.cpu().then((data) => {
                            embed.addFields({ name: 'CPU', value: `Name: ${data.manufacturer} ${data.brand}\nStepping ${data.stepping}\nProcessors: ${data.processors}\nCores: ${data.cores}\nCurrent Speed: ${data.speed}\n\nCurrent Cache (L1D, L1I, L2, L3): \n${data.cache.l1d}, ${data.cache.l1i}, ${data.cache.l2}, ${data.cache.l3}`, inline: true });

                            system.mem().then((mem) => {
                                embed.addFields({ name: 'Memory', value: `Total: ${Math.round(mem.total / (1024 * 1024 * 1024) * 100) / 100}GB\nFree: ${Math.round(mem.free / (1024 * 1024 * 1024) * 100) / 100}GB\nUsed: ${Math.round(mem.used / (1024 * 1024 * 1024) * 100) / 100}GB\nBuffered Cache: ${Math.round(mem.buffcache / (1024 * 1024) * 100) / 100}MB`, inline: true });
                                return interaction.reply({ embeds: [embed] });
                            });
                        });
                    });
                });
            } catch {
                return interaction.reply('Error occurred');
            }
        } catch {
            return interaction.reply('System information dependency not installed');
        }
    },
} as SlashCommand;