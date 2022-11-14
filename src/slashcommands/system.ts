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
        if (config.hostID !== interaction.user.id) {
            return interaction.reply({ content: 'not authorized', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('System Stats')
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() ?? '' })
            .setColor('Green');

        try {
            await interaction.reply({content: 'Working...', ephemeral: true});

            let cpu = await system.cpu();
            let mem = await system.mem();
            let os = await system.osInfo();
            let processes = await system.processes();

            embed.addFields({ name: 'Basic Information', value: `Uptime: ${formatTime(Number(system.time().uptime))}\nTimezone: ${system.time().timezone}\nOperating System: ${os.distro} ${os.release} ${os.arch}\nCurrent Processes: ${processes.list.length}`, inline: true });
            embed.addFields({ name: 'CPU', value: `Name: ${cpu.manufacturer} ${cpu.brand}\nStepping ${cpu.stepping}\nProcessors: ${cpu.processors}\nCores: ${cpu.cores}\nCurrent Speed: ${cpu.speed}GHz\n\nCurrent Cache (L1D, L1I, L2, L3): \n${cpu.cache.l1d}, ${cpu.cache.l1i}, ${cpu.cache.l2}, ${cpu.cache.l3}`, inline: true });
            embed.addFields({ name: 'Memory', value: `Total: ${Math.round(mem.total / (1024 * 1024 * 1024) * 100) / 100}GB\nFree: ${Math.round(mem.free / (1024 * 1024 * 1024) * 100) / 100}GB\nUsed: ${Math.round(mem.used / (1024 * 1024 * 1024) * 100) / 100}GB\nBuffered Cache: ${Math.round(mem.buffcache / (1024 * 1024) * 100) / 100}MB`, inline: true });

            return interaction.editReply({ embeds: [embed], content: "" });
        } catch (err) {
            console.log(err);
            return interaction.reply('Error occurred');
        }
    },
} as SlashCommand;