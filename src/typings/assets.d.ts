import { Snowflake } from 'discord.js';

export interface GlobalLeaderboardUserStats {
    discordID: Snowflake;
    pinged: number;
}

export interface GlobalLeaderboardTotalData {
    users: GlobalLeaderboardUserStats[];
}

export interface BlockedChannelData {
    blocked: Snowflake[];
}

export interface PingCooldownUserStats {
    discordID: Snowflake;
    lastping: number;
}

export interface GlobalPingCooldownTotalData {
    users: PingCooldownUserStats[];
}