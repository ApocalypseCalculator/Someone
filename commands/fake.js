const config = require('../data/config')

exports.name = 'fake';
exports.verify = function (msg) {
    return true;
}

exports.execute = function (msg, args, client) {
    if (msg.mentions.users.size > 0 || msg.mentions.roles.size > 0 || msg.mentions.everyone || /@everyone/.test(msg.content) || /@here/.test(msg.content) || /<@!?&?[0,9]{18}>/.test(msg.content)) {
        msg.reply('Ahem I will not ping in a fake message');
    }
    else if (msg.content.split(' ').length <= 1) {
        msg.reply('Yo you need to give me a message');
    }
    else {
        let targetmsg = msg.content.slice(`${config.prefix}fake`.length);
        let members = [];
        var amount = 0;
        msg.guild.members.fetch().then(memberz => {
            memberz.each((member, key) => {
                if (!member.user.bot && member != msg.member) {
                    if (msg.channel.permissionsFor(member).has('VIEW_CHANNEL') && msg.channel.permissionsFor(member).has('READ_MESSAGE_HISTORY')) {
                        members.push(member);
                        amount++;
                    }
                }
            })
            var randomn = Math.round((amount - 1) * Math.random());
            var faker = members[randomn];
            msg.channel.createWebhook(faker.displayName, {
                avatar: faker.user.avatarURL(),
                reason: `Fake message requested by ${msg.author.tag} (${msg.author.id})`
            }).then(webhook => {
                msg.delete();
                webhook.send(targetmsg).then((message) => {
                    console.log(`fake message for ${faker.id} created by ${msg.author.id}. Link suffix is ${message.url.slice('https://discordapp.com/channels/'.length)}`);
                });
                setTimeout(function () {
                    webhook.delete();
                }, 1000);
            }).catch(error => {
                console.log(error);
                msg.channel.send(`There was an error with making the fake message. This is usually caused by missing permissions. Please grant me either admin or manage webhook + manage messages permissions for this channel. You can contact ApocalypseCalculator <@${config.creatorid}> if this problem persists`);
            });
        }).catch(err => msg.channel.send('Error on member list fetch'));
    }
}
