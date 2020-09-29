const Discord = require('discord.js');

exports.name = 'invite';
exports.verify = function (msg) {
    return true;
}

exports.execute = function (msg, args, client) {
    //hardcoded again LUL
    const msgembed = new Discord.MessageEmbed()
        .setColor(13833)
        .setAuthor(client.user.username, client.user.avatarURL())
        .setTitle('Invite Me To Your Server!')
        .addField('Invite Link', '[Click Me!](https://discord.com/api/oauth2/authorize?client_id=705135432588853288&permissions=8&scope=bot)')
        .setTimestamp()
        .setFooter("Someone Bot By ApocalypseCalculator - Licensed", client.user.avatarURL());
    msg.channel.send(msgembed);
}
