import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../typings/bot';

export = {
    name: 'random',
    description: 'Fetches a random member from a server.',
    global: true,
    options: [{
        name: 'amount',
        description: 'How many members to fetch.',
        type: 'INTEGER',
        required: true,
    }],
    execute: (interaction, client) => {
        if(isNaN(interaction.options.getInteger('amount', true))) {
            return interaction.reply('Invalid arguments');
        } else {
            const members: string[] = [];

            return interaction.guild?.members.fetch().then((memberz) => {
                memberz.forEach((member, key) => {
                    if(!member.user.bot) {
                        members.push(key);
                    }
                });

                if(members.length <= interaction.options.getInteger('amount', true)) {
                    return interaction.reply(`Too little members in this server to pick ${interaction.options.getInteger('amount', true)} random members`);
                } else if(interaction.options.getInteger('amount', true) <= 0) {
                    return interaction.reply('Please provide a valid number > 0');
                } else {
                    let list = '';
                    for(let i = 0; i < interaction.options.getInteger('amount', true); i++) {
                        const randomNum = Math.round((members.length - 1) * Math.random());
                        list += `<@${members[randomNum]}> `;
                        members.splice(randomNum, 1);
                    }

                    if(list.length >= 1990) {
                        return interaction.reply('Your member list is wayyyy too long. Try a smaller number maybe?');
                    } else {
                        const embed = new MessageEmbed()
                            .setColor(13833)
                            .addField(`Here ${(interaction.options.getInteger('amount', true) == 1 ? 'is' : 'are')} your ${interaction.options.getInteger('amount', true)} random member${(interaction.options.getInteger('amount', true) == 1) ? '' : 's'}`, list)
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