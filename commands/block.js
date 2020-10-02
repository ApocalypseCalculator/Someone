const fs = require('fs')
const base = require('../lib/helpermethods')

exports.name = 'block'
exports.verify = function (msg) {
  return msg.member.hasPermission('ADMINISTRATOR')
}

exports.execute = function (msg, args, client) {
  const raw = fs.readFileSync('./data/blocked.json')
  const parsed = JSON.parse(raw)
  if (msg.mentions.channels.size === 1) {
    if (parsed.blocked.includes(msg.mentions.channels.first().id)) {
      parsed.blocked = base.removeFromArray(parsed.blocked, msg.mentions.channels.first().id)
      const newraw = JSON.stringify(parsed)
      fs.writeFileSync('./data/blocked.json', newraw)
      msg.channel.send('Channel re-enabled for @someone pings :D')
    } else {
      parsed.blocked.push(msg.mentions.channels.first().id)
      const newraw = JSON.stringify(parsed)
      fs.writeFileSync('./data/blocked.json', newraw)
      msg.channel.send('Channel disabled for @someone pings D:')
    }
  } else {
    msg.channel.send('Please mention a channel to disable/re-enable')
  }
}
