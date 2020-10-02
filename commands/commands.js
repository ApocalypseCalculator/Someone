const config = require('../data/config')
const Discord = require('discord.js')

exports.name = 'commands'
exports.verify = function (msg) {
  return true
}

exports.execute = function (msg, args, client) {
  // yus another hardcoded embed woohoo
  var prefix = config.prefix
  const msgembed = new Discord.MessageEmbed()
    .setColor(13833)
    .setAuthor(client.user.username, client.user.avatarURL())
    .setTitle('Someone Bot Commands')
    .setDescription(`This is my command list, to see information about me do ${prefix}info.`)
    .addField('\u200B', '\u200B')
    .addField('Random Ping', 'ping me', true)
    .addField('Ping Command', prefix + 'ping', true)
    .addField('Webhook Clearing Command', prefix + 'whclear', true)
    .addField('Pings Received Counter Command', prefix + 'pingcount', true)
    .addField('Global Ping Leaderboard', prefix + 'gleaderboard', true)
    .addField('Check Global Rank', prefix + 'grank', true)
    .addField('Help Command', prefix + 'help', true)
    .addField('Create fake message with random user', `${prefix}fake`, true)
    .addField('Disabled/Re-enabled @someone', prefix + 'block', true)
    .addField('Experimental Ping Contest Command', prefix + 'pingcontest (not available yet)', true)
    .addField('Information Page', prefix + 'info', true)
    .addField('This Page', prefix + 'commands', true)
    .addField('Privacy Policy', prefix + 'privacy', true)
    .addField('Invite', prefix + 'invite', true)
    .addField('\u200B', '\u200B')
    .setTimestamp()
    .setFooter('Someone Bot By ApocalypseCalculator - Licensed', client.user.avatarURL())
  msg.channel.send(msgembed)
}
