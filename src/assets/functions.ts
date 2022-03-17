import fs from 'fs';
import { config } from './config';
import { Message, Snowflake } from 'discord.js';
import { BlockedChannelData, GlobalLeaderboardTotalData, GlobalLeaderboardUserStats, GlobalPingCooldownTotalData, PingCooldownUserStats } from '../typings/assets';

export async function getRandomUserID(msg: Message): Promise<string> {
    const server = msg.guild;
    const members: Snowflake[] = [];
    let amount = 0;

    await server?.members.fetch();
    server?.members.cache.forEach((member, key) => {
        if(!member.user.bot && member !== msg.member) {
            if(msg.channel.type !== 'DM' && msg.channel.permissionsFor(member).has('VIEW_CHANNEL') && msg.channel.permissionsFor(member).has('READ_MESSAGE_HISTORY')) {
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

export function userCount(msg: Message): Promise<number> | undefined {
    const memberArray: Snowflake[] = [];
    let amount = 0;

    return msg.guild?.members.fetch().then(members => {
        members.forEach((member, key) => {
            if(!member.user.bot && member != msg.member) {
                if(msg.channel.type !== 'DM' && msg.channel.permissionsFor(member).has('VIEW_CHANNEL') && msg.channel.permissionsFor(member).has('READ_MESSAGE_HISTORY')) {
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
    if(index === -1) {
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

export function isDisabled(id: Snowflake): boolean {
    const rawData = fs.readFileSync(`${process.cwd()}/src/data/blocked.json`, { encoding: 'utf-8' });
    const parsed: BlockedChannelData = JSON.parse(rawData);

    return parsed.blocked.includes(id);
}

export function canPing(id: Snowflake): boolean {
    const rawData = fs.readFileSync(`${process.cwd()}/src/data/pingtime.json`, { encoding: 'utf-8' });
    const parsed: GlobalPingCooldownTotalData = JSON.parse(rawData);

    const index = getElementByProperty(parsed.users, 'discordID', id);
    if(index === -1) {
        return true;
    } else if(parsed.users[index].lastping > Date.now() - config.pingcooldown) {
        return false;
    } else {
        return true;
    }
}

export function usedPing(id: Snowflake): void {
    const rawData = fs.readFileSync(`${process.cwd()}/src/data/pingtime.json`, { encoding: 'utf-8' });
    const parsed: GlobalPingCooldownTotalData = JSON.parse(rawData);

    const index = getElementByProperty(parsed.users, 'discordID', id);
    if(index === -1) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getElementByProperty(array: any[], targetID: string, targetValue: string): number {
    for(let i = 0; i < array.length; i++) {
        if(array[i][targetID] === targetValue) {
            return i;
        }
    }

    return -1;
}

export function removeFromArray<T>(array: T[], target: T): T[] {
    const newArray: T[] = [];
    array.forEach((element) => {
        if(element !== target) {
            newArray.push(element);
        }
    });

    return newArray;
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