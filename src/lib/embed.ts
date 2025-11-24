import { Client, EmbedBuilder } from "discord.js";

export default function createBaseEmbed(client: Client | undefined, title: string, description: string): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(13833)
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter({ 
            text: 'Someone Bot By ApocalypseCalculator', 
            iconURL: client ? (client.user?.avatarURL() ?? '') : '' 
        });
}

export function createLeaderboardEmbed(embed: EmbedBuilder, users: Array<{ discordid: string, pinged: number }>, total?: number): EmbedBuilder {
    if(users.length == 0) {
        embed.setDescription('No ranked users found');
        return embed;
    }
    for (let i = 0; i < ((users.length < 10) ? users.length : 10); i++) {
        let medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅';
        embed.addFields({ name: `#${(i + 1)}`, value: `${medal} <@!${users[i].discordid}> : ${users[i].pinged} pings` });
    }
    embed.addFields({ name: '\u200B', value: 'Out of ' + (total ?? users.length)  + ' ranked users' });
    return embed;
}
