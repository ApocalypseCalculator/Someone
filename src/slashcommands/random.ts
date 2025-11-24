import { ApplicationCommandOptionType, GuildChannel, Role } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import createBaseEmbed from '../lib/embed';
import { getRandomUserID } from '../lib/functions';

export = {
    name: 'random',
    description: 'Fetches random members from the server.',
    options: [{
        name: 'amount',
        description: 'How many members to fetch.',
        type: ApplicationCommandOptionType.Integer,
        required: true,
    }, {
        name: 'channel',
        description: 'Channel to take random list from. (Entire server if not specified)',
        type: ApplicationCommandOptionType.Channel,
        required: false,
    }, {
        name: 'role',
        description: 'Role to take random list from.',
        type: ApplicationCommandOptionType.Role,
        required: false,
    }, {
        name: 'includebots',
        description: 'Whether to include bots in the random selection. (Default: false)',
        type: ApplicationCommandOptionType.Boolean,
        required: false,
    }, {
        name: 'includeself',
        description: 'Whether to include yourself in the random selection. (Default: true)',
        type: ApplicationCommandOptionType.Boolean,
        required: false,
    }, {
        name: 'debug',
        description: 'Show full details of selection. (Default: false)',
        type: ApplicationCommandOptionType.Boolean,
        required: false,
    }],
    execute: async (interaction, client) => {
        const number = interaction.options.get('amount', true).value;
        const channel = interaction.options.getChannel('channel', false) as GuildChannel;
        const role = interaction.options.getRole('role', false) as Role;
        const includebots = !!(interaction.options.get('includebots', false)?.value);
        const includeself = !!(interaction.options.get('includeself', false)?.value ?? true);
        const debug = !!(interaction.options.get('debug', false)?.value);

        if (typeof number !== 'number' || isNaN(number)) {
            return interaction.reply('Invalid arguments');
        }
        else if (number <= 0) {
            return interaction.reply('Please provide a valid number > 0');
        }
        else {
            await interaction.deferReply();
            const { id: picked, count } = await getRandomUserID(
                interaction,
                includeself,
                number,
                includebots,
                channel,
                role
            )

            if (picked.length < number) {
                return interaction.followUp(`Not enough members in your selection to pick ${number} random members`);
            } else {
                let list = picked.map(m => `<@${m}>`).join('\n');

                if (list.length >= 4000) {
                    return interaction.followUp('Your member list is too long. Try a smaller number maybe?');
                } else {
                    const embed = createBaseEmbed(
                        client,
                        `${number} random member${(number == 1) ? '' : 's'}`,
                        list
                    )
                    if (debug) {
                        embed.addFields({
                            name: 'Debug Info',
                            inline: true,
                            value: `Channel: ${channel ? `<#${channel.id}>` : 'Entire Server'}\n` +
                                `Role: ${role ? `<@&${role.id}>` : 'N/A'}\n` +
                                `Include Bots: ${includebots}\n` +
                                `Include Self: ${includeself}\n` +
                                `Total Picked: ${picked.length} out of ${count}`
                        })
                    }
                    return interaction.followUp({ embeds: [embed] });
                }
            }
        }
    },
} as SlashCommand;