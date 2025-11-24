import { Client, EmbedBuilder } from "discord.js";

export default function createBaseEmbed(client: Client | undefined, title: string, description: string) {
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
