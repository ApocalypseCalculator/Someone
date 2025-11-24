import { config } from '../config';
import { Channel, CommandInteraction, GuildChannel, GuildMember, Message, Role, Snowflake, TextBasedChannel, TextChannel, VoiceChannel, Webhook, WebhookClient } from 'discord.js';
import prisma from '../lib/db'
import { throttledAllMembersFetch } from './membercache';

export async function getRandomUserID(
    msg: Message | CommandInteraction,
    includeself: boolean = false,
    select: number = 1,
    includebots: boolean = false,
    channel?: GuildChannel,
    role?: Role
): Promise<{ id: string[], count: number }> {
    const server = msg.guild;
    if (!server) {
        return {
            id: [],
            count: 0
        }
    }
    const members: Snowflake[] = [];
    let amount = 0;

    await throttledAllMembersFetch(server);
    let memberslist: GuildMember[] = [];
    if (channel && channel.members) {
        memberslist = channel.members.map(m => m);
    }
    else {
        memberslist = server.members.cache.map(m => m);
    }
    memberslist.forEach((member) => {
        if ((!member.user.bot || includebots) &&
            (member !== msg.member || includeself) &&
            (!role || member.roles.cache.has(role.id))) {
            members.push(member.id);
            amount++;
        }
    });

    const picked = [];
    const topick = Math.min(select, members.length);
    for (let i = 0; i < topick; i++) {
        const randomNum = Math.round((members.length - 1) * Math.random());
        picked.push(members[randomNum]);
        members.splice(randomNum, 1);
    }

    if (config.logging) {
        console.log(`Returned ID: ${picked} out of ${amount}\tServer: ${msg.guild?.id}`);
    }

    return {
        id: picked,
        count: amount
    };
}

export async function sendWebhook(interaction: Message | CommandInteraction, usr: GuildMember, content: string): Promise<boolean> {
    let channel = await prisma.channel.findUnique({
        where: {
            channelid: interaction.channelId
        }
    });

    if (channel && channel.webhook && channel.webhook !== "") {
        const whclient = new WebhookClient({
            url: channel.webhook
        });
        await whclient.send({
            username: usr.displayName,
            avatarURL: usr.displayAvatarURL() ?? usr.user.defaultAvatarURL,
            content: content
        }).catch(async (err) => {
            console.log(err);
            return await sendNewWebhook(interaction, usr, content);
        });
        return true;
    }
    else {
        return await sendNewWebhook(interaction, usr, content);
    }
}

async function sendNewWebhook(interaction: Message | CommandInteraction, usr: GuildMember, content: string): Promise<boolean> {
    if (!(interaction.channel instanceof TextChannel)) {
        return false;
    }
    let whclient = await interaction.channel.createWebhook({
        name: "@someone webhook",
        reason: `Webhook to run @someone through`,
    }).catch(err => {
        return false;
    });
    if (!whclient || !(whclient instanceof Webhook)) {
        return false;
    }
    await whclient.send({
        username: usr.displayName,
        avatarURL: usr.displayAvatarURL() ?? usr.user.defaultAvatarURL,
        content: content
    })
    await prisma.channel.upsert({
        where: {
            channelid: interaction.channelId
        },
        update: {
            webhook: whclient.url
        },
        create: {
            channelid: interaction.channelId,
            guild: interaction.guildId ?? "",
            webhook: whclient.url
        }
    });
    return true;
}

export async function addToLeaderboard(id: Snowflake): Promise<void> {
    await prisma.user.upsert({
        where: {
            discordid: id
        },
        update: {
            pinged: {
                increment: 1
            }
        },
        create: {
            discordid: id,
            lastping: new Date(0),
            pinged: 1
        }
    })
}

export async function isDisabled(id: Snowflake): Promise<boolean> {
    let chnldata = await prisma.channel.findUnique({
        where: {
            channelid: id
        }
    });
    if (chnldata && chnldata.blocked) { //directly returning this makes typescript error
        return true;
    }
    else {
        return false;
    }
}

export async function canPing(id: Snowflake): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: {
            discordid: id
        }
    });
    if (user && user.lastping.getTime() > Date.now() - config.pingcooldown) {
        return false;
    }
    else {
        return true;
    }
}

export async function usedPing(id: Snowflake): Promise<void> {
    await prisma.user.upsert({
        where: {
            discordid: id
        },
        update: {
            lastping: new Date()
        },
        create: {
            discordid: id,
            lastping: new Date(),
            pinged: 0
        }
    })
}

export function formatTime(num: number): string {
    let left = num;

    const days = Math.floor(num / (60 * 60.0 * 24));
    left -= (days * 60 * 60 * 24);

    const hours = Math.floor(left / (60 * 60.0));
    left -= (hours * 60 * 60);

    const minutes = Math.floor(left / 60.0);
    left -= (minutes * 60);

    const str = `${days} days, ${hours} hours, ${minutes} minutes, ${left} seconds`;
    return str;
}