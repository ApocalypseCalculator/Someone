const fs = require('fs')
const config = require('../data/config')

exports.getrandomuserid = function (msg) {
  var server = msg.guild
  const members = []
  var amount = 0
  server.members.cache.forEach((member, key) => {
    if (!member.user.bot && member !== msg.member) {
      if (msg.channel.permissionsFor(member).has('VIEW_CHANNEL') && msg.channel.permissionsFor(member).has('READ_MESSAGE_HISTORY')) {
        members.push(key)
        amount++
      }
    }
  })
  var randomn = Math.round((amount - 1) * Math.random())
  var id = members[randomn]
  console.log('returned id: ' + id + '\t server: ' + msg.guild.id)
  return id
}

exports.usercount = function (msg) {
  var server = msg.guild
  const members = []
  var amount = 0
  server.members.cache.forEach((member, key) => {
    if (!member.user.bot && member !== msg.member) {
      if (msg.channel.permissionsFor(member).has('VIEW_CHANNEL') && msg.channel.permissionsFor(member).has('READ_MESSAGE_HISTORY')) {
        members.push(key)
        amount++
      }
    }
  })
  return amount
}

exports.addtoLeaderboard = function (id) {
  const rawdata = fs.readFileSync('./data/globalLeaderboard.json')
  const parsed = JSON.parse(rawdata)
  const botuser = (element) => element.discordid === id
  var x = parsed.users.findIndex(botuser)
  if (x === -1) {
    const newuser = {
      discordid: id,
      pinged: 1
    }
    parsed.users.push(newuser)
  } else {
    parsed.users[x].pinged++
  }
  const newdata = JSON.stringify(parsed)
  fs.writeFileSync('./data/globalLeaderboard.json', newdata)
}

exports.removeFromArray = function (arr, target) {
  const newarr = []
  arr.forEach(e => {
    if (e !== target) {
      newarr.push(e)
    }
  })
  return newarr
}

exports.isDisabled = function (id) {
  const raw = fs.readFileSync('./data/blocked.json')
  const parsed = JSON.parse(raw)
  return parsed.blocked.includes(id)
}

exports.canPing = function (id) {
  const raw = fs.readFileSync('./data/pingtime.json')
  const parsed = JSON.parse(raw)
  var pos = getElementByProperty(parsed.users, 'discordid', id)
  if (pos === -1) {
    return true
  } else {
    if (parsed.users[pos].lastping > Date.now() - config.pingcooldown) {
      return false
    } else {
      return true
    }
  }
}

exports.usedPing = function (id) {
  const raw = fs.readFileSync('./data/pingtime.json')
  const parsed = JSON.parse(raw)
  var pos = getElementByProperty(parsed.users, 'discordid', id)
  if (pos === -1) {
    const newobj = {
      discordid: id,
      lastping: Date.now()
    }
    parsed.users.push(newobj)
  } else {
    parsed.users[pos].lastping = Date.now()
  }
  const newraw = JSON.stringify(parsed)
  fs.writeFileSync('./data/pingtime.json', newraw)
}

function getElementByProperty (array, targetId, targetValue) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][targetId] === targetValue) {
      return i
    }
  }
  return -1
}
