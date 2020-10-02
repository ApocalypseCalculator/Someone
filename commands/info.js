const config = require('../data/config')
const Discord = require('discord.js')

exports.name = 'info'
exports.verify = function (msg) {
  return true
}

exports.execute = function (msg, args, client) {
  // yes these are hardcoded cuz I'm too lazy
  const msgembed = new Discord.MessageEmbed()
    .setColor(13833)
    .setAuthor(client.user.username, client.user.avatarURL())
    .setTitle('Information About Someone Bot')
    .setDescription(`whats up. I am the annoying pinger bot called Someone. Developed by ApocalypseCalculator (<@${config.creatorid}>). To use my annoying feature, simply ping me. These are the other commands of this wonderful Someone bot. \n\nTip: random ping/fake msg users are logged inside server audit log, inside webhook creation reason`)
    .addField('\u200B', '\u200B')
    .addField('Server Count', client.guilds.cache.size, true)
    .addField('Bot List Links', '[top.gg](https://top.gg/bot/705135432588853288)', true)
    .addField('Vote Links', '[top.gg](https://top.gg/bot/705135432588853288/vote)', true)
    .addField('Invite Links', '[Click Here!](https://discord.com/api/oauth2/authorize?client_id=705135432588853288&permissions=8&scope=bot)', true)
    .addField('Support Discord Server', '[Someone Support](https://discord.gg/5WmPnYx)', true)
    .addField('GitHub Repository', '[ApocalypseCalculator/Someone](https://github.com/ApocalypseCalculator/Someone)', true)
    .addField('Commands List', config.prefix + 'commands', true)
    .addField('This Page', config.prefix + 'info', true)
    .addField('\u200B', '\u200B')
    .setTimestamp()
    .setFooter('Someone Bot By ApocalypseCalculator - Licensed', client.user.avatarURL())
  msg.channel.send(msgembed)
}
