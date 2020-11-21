const Discord = require('discord.js');

exports.name = 'random';
exports.verify = function (msg) {
    return true;
}

exports.execute = function (msg, args, client) {
    if (!args[0] || isNaN(parseInt(args[0]))) {
        msg.channel.send('Invalid arguments');
    }
    else {
        let members = [];
        msg.guild.members.fetch().then(memberz => {
            memberz.forEach((member, key) => {
                if (!member.user.bot) {
                    members.push(key);
                }
            });
            if (members.length <= parseInt(args[0])) {
                msg.channel.send(`Too little members in this server to pick ${args[0]} random members`);
            }
            else if (parseInt(args[0]) <= 0) {
                msg.channel.send('Please provide a valid number');
            }
            else {
                let list = "";
                for (let i = 0; i < parseInt(args[0]); i++) {
                    let randomn = Math.round((members.length - 1) * Math.random());
                    list += `<@${members[randomn]}> `
                    members.splice(randomn, 1);
                }
                if (list.length >= 1990) {
                    msg.channel.send('Your member list is wayyyy too long. Try a smaller number maybe?');
                }
                else {
                    const msgembed = new Discord.MessageEmbed()
                        .setColor(13833)
                        .addField(`Here ${(parseInt(args[0] == 1) ? 'is' : 'are')} your ${args[0]} random member${(parseInt(args[0]) == 1) ? '' : 's'}`, list)
                        .setFooter("Someone Bot By ApocalypseCalculator - Licensed", client.user.avatarURL());
                    msg.channel.send(msgembed);
                }
            }
        }).catch(err => {
            msg.channel.send('API request failed');
            console.log(err)
        });
    }
}
