const Discord = require('discord.js');

exports.name = 'privacy';
exports.verify = function (msg) {
    return true;
}

exports.execute = function (msg, args, client) {
    const msgembed = new Discord.MessageEmbed()
        .setColor(13833)
        .setAuthor(client.user.username, client.user.avatarURL())
        .setTitle('Privacy Policy')
        .addField("\u200B", "\u200B")
        .addField('Privacy Policy of Someone bot', 'By adding Someone Bot™️ to your server, you agree to having your Discord snowflakes collected by us and retained indefinitely. We collect this data in order to store information on how many times a user has been pinged through this bot. This privacy policy can change without notice, and we encourage you to check it regularly. If you do not agree with this policy, please promptly kick Someone Bot from your server.')
        .addField("\u200B", "\u200B")
        .setTimestamp()
        .setFooter("Someone Bot By ApocalypseCalculator - Licensed", client.user.avatarURL());
    msg.channel.send(msgembed);
}
