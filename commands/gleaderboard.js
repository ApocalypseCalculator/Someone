const config = require('../data/config')
const Discord = require('discord.js');
const fs = require('fs');

exports.name = 'gleaderboard';
exports.verify = function (msg) {
    return true;
}

exports.execute = function (msg, args, client) {
    const msgembed = new Discord.MessageEmbed()
        .setColor(13833)
        .setAuthor(client.user.username, client.user.avatarURL())
        .setTitle('Global Ping Leaderboard')
        .setDescription('The following are the first 10 people on the leaderboard')
        .addField("\u200B", "\u200B")
        .setTimestamp()
        .setFooter("Someone Bot By ApocalypseCalculator - Licensed", client.user.avatarURL());
    let rawdata = fs.readFileSync('./data/globalLeaderboard.json');
    let parsed = JSON.parse(rawdata);
    let list = parsed.users;
    list.sort((a, b) => (a.pinged > b.pinged) ? 1 : -1);
    for (var i = 0; i < ((list.length < 10) ? list.length : 10); i++) {
        if (i == 0) {
            msgembed.addField('#' + (i + 1), '🥇<@!' + list[list.length - i - 1].discordid + '> ' + ((list[list.length - i - 1].discordid === config.creatorid) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings');
        }
        else if (i == 1) {
            msgembed.addField('#' + (i + 1), '🥈<@!' + list[list.length - i - 1].discordid + '> ' + ((list[list.length - i - 1].discordid === config.creatorid) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings');
        }
        else if (i == 2) {
            msgembed.addField('#' + (i + 1), '🥉<@!' + list[list.length - i - 1].discordid + '> ' + ((list[list.length - i - 1].discordid === config.creatorid) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings');
        }
        else {
            msgembed.addField('#' + (i + 1), '🏅<@!' + list[list.length - i - 1].discordid + '> ' + ((list[list.length - i - 1].discordid === config.creatorid) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings');
        }
    }
    msgembed.addField("\u200B", 'Out of ' + list.length + ' ranked users').addField("\u200B", "\u200B")
    msg.channel.send(msgembed);
}
