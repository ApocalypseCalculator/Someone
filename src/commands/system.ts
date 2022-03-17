import { MessageEmbed } from 'discord.js';
import { Command } from '../typings/bot';
import { config } from '../assets/config';
import { formatTime } from '../assets/functions';
import system from 'systeminformation';

export = {
    name: 'system',
    verify: (msg) => {
        return config.hostID === msg?.author.id;
    },
    execute: async (msg) => {
        try {
            const embed = new MessageEmbed()
                .setTitle('System Stats')
                .setAuthor({ name: msg.author.username, iconURL: msg.author.avatarURL() ?? '' })
                .setColor('GREEN');

            try {
                return await system.osInfo((os) => {
                    system.processes((processes) => {
                        embed.addField('Basic Information', `Uptime: ${formatTime(Number(system.time().uptime))}\nTimezone: ${system.time().timezone}\nOperating System: ${os.distro} ${os.release} ${os.arch}\nCurrent Processes: ${processes.list.length}`, true);

                        system.cpu().then((data) => {
                            embed.addField('CPU', `Name: ${data.manufacturer} ${data.brand}\nStepping ${data.stepping}\nProcessors: ${data.processors}\nCores: ${data.cores}\nCurrent Speed: ${data.speed}\n\nCurrent Cache (L1D, L1I, L2, L3): \n${data.cache.l1d}, ${data.cache.l1i}, ${data.cache.l2}, ${data.cache.l3}`, true);

                            system.mem().then((mem) => {
                                embed.addField('Memory', `Total: ${Math.round(mem.total / (1024 * 1024 * 1024) * 100) / 100}GB\nFree: ${Math.round(mem.free / (1024 * 1024 * 1024) * 100) / 100}GB\nUsed: ${Math.round(mem.used / (1024 * 1024 * 1024) * 100) / 100}GB\nBuffered Cache: ${Math.round(mem.buffcache / (1024 * 1024) * 100) / 100}MB`, true);
                                return msg.reply({ embeds: [embed] });
                            });
                        });
                    });
                });
            } catch {
                return msg.reply('Error occurred');
            }
        } catch {
            return msg.reply('System information dependency not installed');
        }
    },
} as Command;