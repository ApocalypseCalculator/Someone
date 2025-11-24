import { ChannelType, Client, CommandInteraction, Guild, Message, Role } from "discord.js";
import { addToLeaderboard, canPing, getRandomUserID, isDisabled, sendWebhook, usedPing } from "./functions";
import { hasPing, mentionRegex } from "./regex";
import { config } from "../config";

// core @someone logic

export default async function pingSomeone(
    client: Client,
    author: string,
    source: string,
    msg: Message | CommandInteraction,
    guild: Guild,
    failed_callback: (response: string) => Promise<void>,
    send_callback: () => Promise<void>,
    includeself: boolean = false,
    role?: Role
): Promise<void> {
    const PING_REGEX = mentionRegex(client.user?.id ?? "");
    // debugging
    if (config.logging) {
        console.log(`Attempted ping by: ${author}\nContent: ${source}`);
    }

    if (!PING_REGEX.test(source)) {
        return failed_callback('missing @someone ping in source');
    }
    if (!(await canPing(author))) {
        return failed_callback(`calm down with the pings dude. (${config.pingcooldown / 1000}s cooldown)`);
    }
    if (source.includes('\\<@')) {
        return failed_callback('please don\'t use escaped pings');
    }
    if (hasPing(source.replace(PING_REGEX, ''))) {
        return failed_callback('I cannot ping other users when pinged through @someone');
    }
    if (msg.channel?.type !== ChannelType.GuildText) {
        return failed_callback('incorrect channel type');
    }
    if (await isDisabled(msg.channel!.id)) {
        return failed_callback('@someone is disabled in this channel :(');
    }

    let ping_amt = Math.max(source.match(PING_REGEX)?.length ?? 1, 1);

    const { id: randID, count: usrcount } = await getRandomUserID(
        msg,
        includeself,
        ping_amt,
        false,
        msg.channel as any,
        role
    );
    let author_member = await guild.members.fetch(author);
    if (!author_member) {
        return failed_callback('unable to fetch member data');
    }
    if (!usrcount || usrcount <= 1) {
        return failed_callback('Your selection has only 1 non-bot user in this channel.');
    }
    if (randID.length == 0) {
        return failed_callback('unable to get random user');
    }
    if (ping_amt > randID.length) {
        return failed_callback(`you pinged me ${ping_amt} times, but there are only ${randID.length} random users available to ping!`);
    }
    if (author_member.displayName.includes('clyde')) {
        return failed_callback('I\'m really sorry, but for some reason Discord doesn\'t allow the name \'clyde\' in webhooks. Would be great if you changed your nickname!');
    }

    try {
        let success = await sendWebhook(
            msg,
            author_member,
            replaceString(source, PING_REGEX, randID.map(id => `<@${id}>`))
        );
        if (!success) {
            return failed_callback('There was an error sending the ping. This may be due to missing create webhook permissions.');
        }
        await Promise.all(randID.filter(id => id !== author).map(id => addToLeaderboard(id)));
        await usedPing(author);
        await send_callback();
        return;
    }
    catch {
        return failed_callback('There was an error with performing the random ping. Please contact the support server if this problem persists.');
    }
};

function replaceString(source: string, regex: RegExp, replace: string[]): string {
    let idx = 0;
    return source.replace(regex, () => replace[idx++] ?? "");
}
