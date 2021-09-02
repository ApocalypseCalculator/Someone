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

export interface BotError {
    err: string;
    id: string;
    time: number;
    server: Snowflake;
    user: Snowflake;
    command: string;
}