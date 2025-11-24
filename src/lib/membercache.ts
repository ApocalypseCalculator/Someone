import { config } from '../config';
import { Guild } from 'discord.js';
import prisma from '../lib/db'

/*
throttle "all members" fetches to once per 30 minutes, returns true if a hard fetch occurred
downstream consumers should use member cache after calling this
*/
export async function throttledAllMembersFetch(guild: Guild): Promise<boolean> {
    let guilddata = await prisma.guild.findUnique({
        where: {
            guildid: guild.id
        }
    });
    if (guilddata && guilddata.lastmemberfetch.getTime() > Date.now() - 30 * 60 * 1000) {
        if (!guilddata.djs_members_uncached) {
            return false;
        }
        else {
            let cachedusers = (await prisma.memberByGuildCache.findMany({
                where: {
                    guildid: guild.id
                }
            })).map(u => u.discordid);
            if (!cachedusers || cachedusers.length === 0) {
                return false;
            }
            // hard fetch existing local cache users
            await guild.members.fetch({
                user: cachedusers
            })
            // we use update here because entry must exist
            await prisma.guild.update({
                where: {
                    guildid: guild.id
                },
                data: {
                    djs_members_uncached: false
                }
            })
            updateMemberCacheForGuild(guild, cachedusers);
        }
    }
    else {
        await guild.members.fetch();
        await prisma.guild.upsert({
            where: {
                guildid: guild.id
            },
            update: {
                lastmemberfetch: new Date()
            },
            create: {
                guildid: guild.id,
                lastmemberfetch: new Date()
            }
        });
        updateMemberCacheForGuild(guild);
    }
    return true;
}

async function updateMemberCacheForGuild(guild: Guild, oldmembers?: string[]): Promise<void> {
    if (!oldmembers) {
        oldmembers = (await prisma.memberByGuildCache.findMany({
            where: {
                guildid: guild.id
            }
        })).map(m => m.discordid);
    }
    let memberstoremove = oldmembers.filter(id => !guild.members.cache.has(id));
    let oldmembersmap = new Map<string, boolean>();
    oldmembers.forEach(id => oldmembersmap.set(id, true));
    let memberstoadd = guild.members.cache.filter(m => !m.user.bot && !oldmembersmap.has(m.id)).map(m => m.id);
    await prisma.memberByGuildCache.deleteMany({
        where: {
            guildid: guild.id,
            discordid: {
                in: memberstoremove
            }
        }
    });
    await prisma.memberByGuildCache.createMany({
        data: memberstoadd.map(id => ({
            guildid: guild.id,
            discordid: id
        }))
    });
    return;
}

export async function markUncachedOnColdStart(): Promise<void> {
    await prisma.guild.updateMany({
        where: {
            djs_members_uncached: false
        },
        data: {
            djs_members_uncached: true
        }
    });
    if (config.logging) {
        console.log('Reset local member cache state');
    }
    return;
}
