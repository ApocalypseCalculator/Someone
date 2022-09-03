import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../typings/bot';

export = {
    name: 'random',
    description: 'Fetches a random member from a server.',
    global: true,
    options: [{
        name: 'amount',
        description: 'How many members to fetch.',
        type: ApplicationCommandOptionType.Integer,
        required: true,
    }],
    execute: (interaction, client) => {
        const number = interaction.options.get('amount', true).value;
        if(typeof number !== 'number' || isNaN(number)) {
            return interaction.reply('Invalid arguments');
        } else {
            const members: string[] = [];

            return interaction.guild?.members.fetch().then((memberz) => {
                memberz.forEach((member, key) => {
                    if(!member.user.bot) {
                        members.push(key);
                    }
                });

                if(members.length <= number) {
                    return interaction.reply(`Too little members in this server to pick ${number} random members`);
                } else if(number <= 0) {
                    return interaction.reply('Please provide a valid number > 0');
                } else {
                    let list = '';
                    for(let i = 0; i < number; i++) {
                        const randomNum = Math.round((members.length - 1) * Math.random());
                        list += `<@${members[randomNum]}> `;
                        members.splice(randomNum, 1);
                    }

                    if(list.length >= 1990) {
                        return interaction.reply('Your member list is wayyyy too long. Try a smaller number maybe?');
                    } else {
                        const embed = new EmbedBuilder()
                            .setColor(13833)
                            .addFields({ name: `Here ${(number == 1 ? 'is' : 'are')} your ${number} random member${(number == 1) ? '' : 's'}`, value: list })
                            .setFooter({ text: 'Someone Bot By ApocalypseCalculator - Licensed', iconURL: client?.user?.avatarURL() ?? '' });

                        return interaction.reply({ embeds: [embed] });
                    }
                }
            }).catch((err) => {
                console.log(err);
                return interaction.reply('API request failed');
            });
        }
    },
} as SlashCommand;