import fs from 'fs';
import { config } from './config';
import { ChannelType, CommandInteraction, Message, Snowflake, TextChannel, User, WebhookClient } from 'discord.js';
import { GlobalLeaderboardTotalData, GlobalLeaderboardUserStats, GlobalPingCooldownTotalData, PingCooldownUserStats } from '../typings/assets';
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

    console.log(`Returned ID: ${id}\tServer: ${msg.guild?.id}`);
    return id;
}

export async function sendWebhook(interaction: CommandInteraction, usr: User, content: string): Promise<boolean> {
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
            username: usr.username,
            avatarURL: usr.avatar ?? usr.defaultAvatarURL,
            content: content
        }).catch(async () => {
            return await sendNewWebhook(interaction, usr, content);
        });
        return true;
    }
    else {
        return await sendNewWebhook(interaction, usr, content);
    }
}

async function sendNewWebhook(interaction: CommandInteraction, usr: User, content: string): Promise<boolean> {
    if (!(interaction.channel instanceof TextChannel)) {
        return false;
    }
    let whclient = await interaction.channel.createWebhook({
        name: "@someone webhook",
        reason: `Webhook to run @someone through`,
    }).catch(err => {
        return false;
    });
    if(!whclient || !(whclient instanceof WebhookClient)) {
        return false;
    }
    await whclient.send({
        username: usr.username,
        avatarURL: usr.avatar ?? usr.defaultAvatarURL,
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

export function addToLeaderboard(id: Snowflake): void {
    const rawData = fs.readFileSync(`${process.cwd()}/src/data/globalLeaderboard.json`, { encoding: 'utf-8' });
    const parsed: GlobalLeaderboardTotalData = JSON.parse(rawData);
    const botUser = (element: GlobalLeaderboardUserStats) => element.discordID === id;

    const index = parsed.users.findIndex(botUser);
    if (index === -1) {
        const newUserData: GlobalLeaderboardUserStats = {
            discordID: id,
            pinged: 1,
        };

        parsed.users.push(newUserData);
    } else {
        parsed.users[index].pinged++;
    }

    const newUserData = JSON.stringify(parsed);
    fs.writeFileSync(`${process.cwd()}/src/data/globalLeaderboard.json`, newUserData);
}

export async function isDisabled(id: Snowflake): Promise<boolean> {
    let chnldata = await prisma.channel.findUnique({
        where: {
            channelid: id
        }
    });
    if (chnldata && chnldata.blocked) { //directly returning this makes typescript error
        return false;
    }
    else {
        return true;
    }
}

export function canPing(id: Snowflake): boolean {
    const rawData = fs.readFileSync(`${process.cwd()}/src/data/pingtime.json`, { encoding: 'utf-8' });
    const parsed: GlobalPingCooldownTotalData = JSON.parse(rawData);

    const index = getElementByProperty(parsed.users, 'discordID', id);
    if (index === -1) {
        return true;
    } else if (parsed.users[index].lastping > Date.now() - config.pingcooldown) {
        return false;
    } else {
        return true;
    }
}

export function usedPing(id: Snowflake): void {
    const rawData = fs.readFileSync(`${process.cwd()}/src/data/pingtime.json`, { encoding: 'utf-8' });
    const parsed: GlobalPingCooldownTotalData = JSON.parse(rawData);

    const index = getElementByProperty(parsed.users, 'discordID', id);
    if (index === -1) {
        const newUserData: PingCooldownUserStats = {
            discordID: id,
            lastping: Date.now(),
        };

        parsed.users.push(newUserData);
    } else {
        parsed.users[index].lastping = Date.now();
    }

    const newData = JSON.stringify(parsed);
    fs.writeFileSync(`${process.cwd()}/src/data/pingtime.json`, newData);
}

export function getElementByProperty(array: PingCooldownUserStats[], targetID: keyof PingCooldownUserStats, targetValue: string): number {
    for (let i = 0; i < array.length; i++) {
        if (array[i][targetID] === targetValue) {
            return i;
        }
    }

    return -1;
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