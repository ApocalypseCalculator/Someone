import { config } from './config';
import { ChannelType, CommandInteraction, GuildMember, Message, Snowflake, TextChannel, User, Webhook, WebhookClient } from 'discord.js';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getRandomUserID(msg: Message | CommandInteraction): Promise<string> {
    const server = msg.guild;
    const members: Snowflake[] = [];
    let amount = 0;

    await server?.members.fetch();
    server?.members.cache.forEach((member, key) => {
        if (!member.user.bot && member !== msg.member) {
            if (msg.channel?.type !== ChannelType.DM && msg.channel?.permissionsFor(member).has('ViewChannel') && msg.channel.permissionsFor(member).has('ReadMessageHistory')) {
                members.push(key);
                amount++;
            }
        }
    });

    const index = Math.round((amount - 1) * Math.random());
    const id = members[index];

    if (config.logging) {
        console.log(`Returned ID: ${id}\tServer: ${msg.guild?.id}`);
    }

    return id;
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

export function userCount(msg: Message): Promise<number> | undefined {
    const memberArray: Snowflake[] = [];
    let amount = 0;

    return msg.guild?.members.fetch().then(members => {
        members.forEach((member, key) => {
            if (!member.user.bot && member != msg.member) {
                if (msg.channel.type !== ChannelType.DM && msg.channel.permissionsFor(member).has('ViewChannel') && msg.channel.permissionsFor(member).has('ReadMessageHistory')) {
                    memberArray.push(key);
                    amount++;
                }
            }
        });

        return amount;
    }).catch(() => {
        return 0;
    });
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
            lastping: 0,
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
    if (user && user.lastping > Date.now() - config.pingcooldown) {
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
            lastping: Date.now()
        },
        create: {
            discordid: id,
            lastping: Date.now(),
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