import { ChannelType, Client, CommandInteraction, Guild, Message } from "discord.js";
import { addToLeaderboard, canPing, getRandomUserID, isDisabled, sendWebhook, usedPing } from "./functions";
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
    includeself: boolean = false
): Promise<void> {
    const PING_REGEX = new RegExp(`<@!?${client.user?.id}>`, 'g');
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

    const { id: randID, count: usrcount } = await getRandomUserID(msg, includeself);
    let author_member = await guild.members.fetch(author);
    if (!author_member) {
        return failed_callback('unable to fetch member data');
    }
    if (!usrcount || usrcount < 5) {
        return failed_callback('This channel has less than 5 non-bot users. To prevent spam pinging to gain rank, @someone is disabled');
    }
    if (author_member.displayName.includes('clyde')) {
        return failed_callback('I\'m really sorry, but for some reason Discord doesn\'t allow the name \'clyde\' in webhooks. Would be great if you changed your nickname!');
    }

    try {
        let success = await sendWebhook(
            msg,
            author_member,
            source.replace(PING_REGEX, `<@${randID}>`)
        );
        if (!success) {
            return failed_callback('There was an error sending the ping. This may be due to missing create webhook permissions.');
        }
        if (randID !== author) {
            await addToLeaderboard(randID);
        }
        await usedPing(author);
        await send_callback();
        return;
    }
    catch {
        return failed_callback('There was an error with performing the random ping. Please contact the support server if this problem persists.');
    }
};

function hasPing(content: string) {
    // good regex trust
    return /<@!?&?\d{17,22}>/.test(content) || /@everyone/.test(content) || /@here/.test(content);
}