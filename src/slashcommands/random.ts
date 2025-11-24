import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../typings/bot';
import { throttledAllMembersFetch } from '../lib/membercache';
import createBaseEmbed from '../lib/embed';

export = {
    name: 'random',
    description: 'Fetches random members from the server.',
    global: true,
    options: [{
        name: 'amount',
        description: 'How many members to fetch.',
        type: ApplicationCommandOptionType.Integer,
        required: true,
    }],
    execute: async (interaction, client) => {
        const number = interaction.options.get('amount', true).value;
        if (typeof number !== 'number' || isNaN(number)) {
            return interaction.reply('Invalid arguments');
        }
        else {
            await interaction.deferReply();
            await throttledAllMembersFetch(interaction.guild!);
            const members: string[] = [];
            interaction.guild!.members.cache.forEach((member, key) => {
                if (!member.user.bot) {
                    members.push(key);
                }
            });

            if (members.length <= number) {
                return interaction.followUp(`Not enough members in this server to pick ${number} random members`);
            } else if (number <= 0) {
                return interaction.followUp('Please provide a valid number > 0');
            } else {
                let picked = [];
                for (let i = 0; i < number; i++) {
                    const randomNum = Math.round((members.length - 1) * Math.random());
                    picked.push(members[randomNum]);
                    members.splice(randomNum, 1);
                }
                let list = picked.map(id => `<@!${id}>`).join('\n');

                if (list.length >= 1900) {
                    return interaction.followUp('Your member list is too long. Try a smaller number maybe?');
                } else {
                    return interaction.followUp({
                        embeds: [
                            createBaseEmbed(
                                client,
                                `${number} random member${(number == 1) ? '' : 's'}`,
                                list
                            )
                        ]
                    });
                }
            }
        }
    },
} as SlashCommand;