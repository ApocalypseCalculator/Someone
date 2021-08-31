import fs from 'fs';
import { config } from '../data/config';
import { Message, Snowflake } from 'discord.js';

export function getRandomUserID(msg: Message) {
    const server = msg.guild;
    const members: Snowflake[] = [];
    let amount = 0;

    server?.members.cache.forEach((member, key) => {
        if(!member.user.bot && member != msg.member) {
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

export function userCount(msg: Message) {
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

/**
 * Remember to add types here later.
 */
export function addToLeaderboard(id: Snowflake) {
    const rawData = fs.readFileSync('../data/globalLeaderboard.json', { encoding: 'utf-8' });
    const parsed = JSON.parse(rawData);
    const botUser = (element) => element.discordID === id;

    const index = parsed.users.findIndex(botUser);
    if(index == -1) {
        const newUserData = {
            discordID: id,
            pinged: 1,
        };

        parsed.users.push(newUserData);
    } else {
        parsed.users[index].pinged++;
    }

    const newUserData = JSON.stringify(parsed);
    fs.writeFileSync('../data/globalLeaderboard.json', newUserData);
}

/**
 * Remember to add types here later.
 */
export function isDisabled(id: Snowflake) {
    const raw = fs.readFileSync('../data/blocked.json', { encoding: 'utf-8' });
    const parsed = JSON.parse(raw);

    return parsed.blocked.includes(id);
}

/**
 * Remember to add types here later.
 */
export function canPing(id: Snowflake) {
    const raw = fs.readFileSync('../data/pingtime.json', { encoding: 'utf-8' });
    const parsed = JSON.parse(raw);

    const index = getElementByProperty(parsed.users, 'discordID', id);
    if(index == -1) {
        return true;
    } else if(parsed.users[index].lastping > Date.now() - config.pingcooldown) {
        return false;
    } else {
        return true;
    }
}

/**
 * Remember to add types here later.
 */
export function usedPing(id: Snowflake) {
    const raw = fs.readFileSync('../data/pingtime.json', { encoding: 'utf-8' });
    const parsed = JSON.parse(raw);

    const index = getElementByProperty(parsed.users, 'discordID', id);
    if(index == -1) {
        const newObj = {
            discordID: id,
            lastping: Date.now(),
        };

        parsed.users.push(newObj);
    } else {
        parsed.users[index].lastping = Date.now();
    }

    const newData = JSON.stringify(parsed);
    fs.writeFileSync('./data/pingtime.json', newData);
}

export function getElementByProperty<T>(array: T[], targetID: string, targetValue: T) {
    for(let i = 0; i < array.length; i++) {
        // @ts-ignore
        if(array[i][targetID] === targetValue) {
            return i;
        }
    }

    return -1;
}

export function removeFromArray<T>(array: T[], target: T) {
    const newArray: T[] = [];
    array.forEach(element => {
        if(element !== target) {
            newArray.push(element);
        }
    });

    return newArray;
}