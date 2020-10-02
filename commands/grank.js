const Discord = require('discord.js')
const fs = require('fs')

exports.name = 'grank'
exports.verify = function (msg) {
  return true
}

exports.execute = function (msg, args, client) {
  const rawdata = fs.readFileSync('./data/globalLeaderboard.json')
  const parsed = JSON.parse(rawdata)
  const list = parsed.users
  list.sort((a, b) => (a.pinged > b.pinged) ? 1 : -1)
  const msgembed = new Discord.MessageEmbed()
    .setColor(13833)
    .setAuthor(client.user.username, client.user.avatarURL())
    .setTitle('Global Ping Leaderboard Rank Information')
    .setDescription("Shows your global rank, to show someone else's rank, append a ping to the command")
    .addField('\u200B', '\u200B')
    .setTimestamp()
    .setFooter('Someone Bot By ApocalypseCalculator - Licensed', client.user.avatarURL())
  if (msg.mentions.members.size > 1) {
    msg.channel.send('Bro please mention one user you want to check pings for')
  } else if (msg.mentions.members.size === 0) {
    const botuser = (element) => element.discordid === msg.author.id
    var x = list.findIndex(botuser)
    if (x !== -1) {
      msgembed.addField('Rank info', '<@!' + msg.author.id + '> is ranked **#' + (list.length - x) + '** globally for pings received').addField('\u200B', '\u200B')
      msg.channel.send(msgembed)
    } else {
      msgembed.addField('Rank info', '<@!' + msg.author.id + '> is not ranked').addField('\u200B', '\u200B')
      msg.channel.send(msgembed)
    }
  } else {
    const botuser = (element) => element.discordid === msg.mentions.users.first().id
    var x = list.findIndex(botuser)
    if (x !== -1) {
      msgembed.addField('Ping Count', '<@!' + msg.mentions.users.first().id + '> is ranked **#' + (list.length - x) + '** globally for pings received').addField('\u200B', '\u200B')
      msg.channel.send(msgembed)
    } else {
      msgembed.addField('Ping Count', '<@!' + msg.mentions.users.first().id + '> is not ranked').addField('\u200B', '\u200B')
      msg.channel.send(msgembed)
    }
  }
}
