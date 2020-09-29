const Discord = require('discord.js');
const fs = require('fs');

exports.name = 'pingcount';
exports.verify = function (msg) {
    return true;
}

exports.execute = function (msg, args, client) {
    const msgembed = new Discord.MessageEmbed()
        .setColor(13833)
        .setAuthor(client.user.username, client.user.avatarURL())
        .addField("\u200B", "\u200B")
        .setTimestamp()
        .setFooter("Someone Bot By ApocalypseCalculator - Licensed", client.user.avatarURL());
    if (msg.mentions.members.size > 1) {
        msg.channel.send('Bro please mention one user you want to check pings for');
    }
    else if (msg.mentions.members.size == 0) {
        msgembed.setTitle('Recorded Pings Received By ' + msg.author.username);
        let rawdata = fs.readFileSync('./data/globalLeaderboard.json');
        let parsed = JSON.parse(rawdata);
        const botuser = (element) => element.discordid === msg.author.id;
        var x = parsed.users.findIndex(botuser);
        if (x != -1) {
            msgembed.addField('Ping Count', '<@!' + msg.author.id + '> has ' + parsed.users[x].pinged + ` received ping${(parsed.users[x].pinged == 1) ? "" : "s"} through this bot`).addField("\u200B", "\u200B")
            msg.channel.send(msgembed);
        }
        else {
            msgembed.addField('Ping Count', '<@!' + msg.author.id + '> has 0 received pings through this bot').addField("\u200B", "\u200B")
            msg.channel.send(msgembed);
        }
    }
    else {
        msgembed.setTitle('Recorded Pings Received By ' + msg.mentions.users.first().username);
        let rawdata = fs.readFileSync('./data/globalLeaderboard.json');
        let parsed = JSON.parse(rawdata);
        const botuser = (element) => element.discordid === msg.mentions.users.first().id;
        var x = parsed.users.findIndex(botuser);
        if (x != -1) {
            msgembed.addField('Ping Count', '<@!' + msg.mentions.users.first().id + '> has ' + parsed.users[x].pinged + ` received ping${(parsed.users[x].pinged == 1) ? "" : "s"} through this bot`).addField("\u200B", "\u200B")
            msg.channel.send(msgembed);
        }
        else {
            msgembed.addField('Ping Count', '<@!' + msg.mentions.users.first().id + '> has 0 received pings through this bot').addField("\u200B", "\u200B")
            msg.channel.send(msgembed);
        }
    }
}
