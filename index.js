const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
var lastpingerid = '';
var reconnectcount = 0;

const token = require('./token');
const prefix = 'someone!';
const creatorid = '492079026089885708'; //you may not change this, or any other parts of the code, without my approval. see README

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    status: "online",
    activity: {
      type: "WATCHING",
      name: ` ${prefix}help for help`
    }
  });
})

client.on('message', msg => {
  if (msg.author.id === client.user.id || msg.author.bot) {
    return;
  }
  else if (msg.channel.type === 'dm' || msg.channel.type === 'group') {
    return;
  }
  else if (msg.content === prefix + 'ping') {
    const message = msg.reply('poooong').then((message) => {
      message.edit(`Pong! Latency is ${Math.floor(message.createdAt - msg.createdAt)}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    });
  }
  else if (msg.mentions.has(client.user) && msg.author.id === lastpingerid) {
    msg.reply('calm down with the pings dude');
  }
  else if (msg.mentions.has(client.user) && !msg.content.includes("\\<@")) {
    if (msg.content.includes('@everyone') || msg.content.includes('@here') || msg.mentions.roles.size > 0) {
      if (!msg.member.hasPermission('MENTION_EVERYONE')) {
        msg.channel.send("I see what you're doing, and I don't like it");
        console.log('attempted ping by: ' + msg.author.username + '\tcontent:\t' + msg.content);
      }
      else {
        msg.channel.send("I'm going to give everyone 1 less ping by not repeating that with a Someone ping. tyvm");
        console.log('attempted ping by: ' + msg.author.username + '\tcontent:\t' + msg.content);
      }
    }
    else {
      if (!isDisabled(msg.channel.id)) {
        msg.guild.members.fetch(client.user).then(member => {
          if (usercount(msg) <= 5) {
            msg.channel.send("This channel has less than 5 non-bot users. To prevent spam pinging to gain rank, @someone is disabled");
          }
          else if (msg.member.displayName.includes('clyde')) {
            msg.channel.send("I'm really sorry, but for some reason Discord doesn't allow the name 'clyde' in webhooks. Would be great if you changed your nickname!");
          }
          else if (member.hasPermission('ADMINISTRATOR') || (member.hasPermission('MANAGE_WEBHOOKS') && member.hasPermission('MANAGE_MESSAGES'))) {
            msg.channel.createWebhook(msg.member.displayName, {
              avatar: msg.author.avatarURL(),
              reason: `Random someone ping requested by ${msg.author.tag} (${msg.author.id})`
            }).then(webhook => {
              console.log('pinger: ' + msg.author.username + '(' + msg.author.id + ')\t content: ' + msg.content.replace('<@!' + client.user.id + '>', '(botping)'));
              var randid = getrandomuserid(msg);
              if (msg.content.includes('<@!' + client.user.id + '>')) {
                webhook.send(msg.content.replace('<@!' + client.user.id + '>', '<@!' + randid + '>'));
              }
              else {
                webhook.send(msg.content.replace('<@' + client.user.id + '>', '<@!' + randid + '>'));
              }
              addtoLeaderboard(randid);
              msg.delete();
              lastpingerid = msg.author.id;
              setTimeout(function () {
                webhook.delete();
              }, 1000);
            }).catch(error => {
              console.log(error);
              msg.channel.send('There was an error with performing the random ping. This is usually caused by missing permissions. Please grant me either admin or manage webhook + manage messages permissions for this channel. You can contact <@492079026089885708> if this problem persists');
            });
          }
          else {
            msg.channel.send('Insufficient permissions. Please either grant me admin or give me both manage webhooks and manage messages');
            const embed = new Discord.MessageEmbed()
              .setColor(13833)
              .setAuthor(client.user.username, client.user.avatarURL())
              .setTitle('Permissions Demo')
              .setImage('https://cdn.discordapp.com/attachments/711370772114833520/711620022669148180/demo3.gif')
              .setTimestamp()
              .setFooter("Someone Bot By ApocalypseCalculator - Licensed", client.user.avatarURL());
            msg.channel.send(embed);
          }
        }).catch(error => console.log(error));
      }
      else {
        msg.channel.send('Channel is disabled from @someone :(');
      }
    }
  }
  else if (msg.mentions.users.has(client.user)) {
    msg.channel.send("I see what you are doing, and I don't like it");
    console.log(msg.author.username + '\t(failed ping)\t: ' + msg.content);
  }
  else if (msg.content === prefix + 'help') {
    msg.reply(`Do ${prefix}info for my information page and ${prefix}commands for my commands list`);
  }
  else if (msg.content === prefix + 'webhookclear' && msg.member.hasPermission('ADMINISTRATOR')) {
    msg.channel.fetchWebhooks().then(hooks => {
      hooks.forEach(hook => {
        hook.delete();
      })
    }).catch(error => {
      console.log(error);
      msg.channel.send(`Error on clearing webhooks. Try again or contact the bot creator in the support server if this problem persists (server invite with \`${prefix}info\` command)`);
    });
    msg.channel.send('webhooks cleared');
  }
  else if (msg.content === prefix + 'info') {
    const msgembed = new Discord.MessageEmbed()
      .setColor(13833)
      .setAuthor(client.user.username, client.user.avatarURL())
      .setTitle('Information About Someone Bot')
      .setDescription("whats up. I am the annoying pinger bot called Someone. Developed by <@" + creatorid + ">. To use my annoying feature, simply ping me. These are the other commands of this wonderful Someone bot. \n\nTip: random ping/fake msg users are logged inside server audit log, inside webhook creation reason")
      .addField("\u200B", "\u200B")
      .addField('Server Count', client.guilds.cache.size, true)
      .addField('Bot List Links', '[top.gg](https://top.gg/bot/705135432588853288)', true)
      .addField('Vote Links', '[top.gg](https://top.gg/bot/705135432588853288/vote)', true)
      .addField('Invite Links', '[Click Here!](https://discord.com/api/oauth2/authorize?client_id=705135432588853288&permissions=8&scope=bot)', true)
      .addField('Support Discord Server', '[Someone Support](https://discord.gg/5WmPnYx)', true)
      .addField('Commands List', prefix + 'commands', true)
      .addField('This Page', prefix + 'info', true)
      .addField("\u200B", "\u200B")
      .setTimestamp()
      .setFooter("Someone Bot By ApocalypseCalculator - Licensed", client.user.avatarURL());
    msg.channel.send(msgembed);
  }
  else if (msg.content === prefix + 'commands') {
    const msgembed = new Discord.MessageEmbed()
      .setColor(13833)
      .setAuthor(client.user.username, client.user.avatarURL())
      .setTitle('Someone Bot Commands')
      .setDescription(`This is my command list, to see information about me do ${prefix}info.`)
      .addField("\u200B", "\u200B")
      .addField('Random Ping', 'ping me', true)
      .addField('Ping Command', prefix + 'ping', true)
      .addField('Webhook Clearing Command', prefix + 'webhookclear', true)
      .addField('Pings Received Counter Command', prefix + 'pingcount', true)
      .addField('Global Ping Leaderboard', prefix + 'gleaderboard', true)
      .addField('Check Global Rank', prefix + 'grank', true)
      .addField('Help Command', prefix + 'help', true)
      .addField('Reconnect Count Since Last Reboot', prefix + 'discordbad', true)
      .addField('Create fake message with random user', `${prefix}fake`, true)
      .addField('Disabled/Re-enabled @someone', prefix + 'block', true)
      .addField('Experimental Ping Contest Command', prefix + 'pingcontest (not available yet)', true)
      .addField('Information Page', prefix + 'info', true)
      .addField('This Page', prefix + 'commands', true)
      .addField('Privacy Policy', prefix + 'privacy', true)
      .addField('Invite', prefix + 'invite', true)
      .addField("\u200B", "\u200B")
      .setTimestamp()
      .setFooter("Someone Bot By ApocalypseCalculator - Licensed", client.user.avatarURL());
    msg.channel.send(msgembed);
  }
  else if (msg.content === prefix + 'invite') {
    const msgembed = new Discord.MessageEmbed()
      .setColor(13833)
      .setAuthor(client.user.username, client.user.avatarURL())
      .setTitle('Invite Me To Your Server!')
      .addField('Invite Link', '[Click Me!](https://discord.com/api/oauth2/authorize?client_id=705135432588853288&permissions=8&scope=bot)')
      .setTimestamp()
      .setFooter("Someone Bot By ApocalypseCalculator - Licensed", client.user.avatarURL());
    msg.channel.send(msgembed);
  }
  else if (msg.content === prefix + 'discordbad') {
    msg.channel.send('Discord API is fucking trash. I had to reconnect ' + reconnectcount + ' times since my last reboot because Discord is fucking stoopid');
  }
  else if (msg.content.startsWith(prefix + 'pingcount')) {
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
      let rawdata = fs.readFileSync('globalLeaderboard.json');
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
      let rawdata = fs.readFileSync('globalLeaderboard.json');
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
  else if (msg.content === prefix + 'gleaderboard') {
    const msgembed = new Discord.MessageEmbed()
      .setColor(13833)
      .setAuthor(client.user.username, client.user.avatarURL())
      .setTitle('Global Ping Leaderboard')
      .setDescription('The following are the first 10 people on the leaderboard')
      .addField("\u200B", "\u200B")
      .setTimestamp()
      .setFooter("Someone Bot By ApocalypseCalculator - Licensed", client.user.avatarURL());
    let rawdata = fs.readFileSync('globalLeaderboard.json');
    let parsed = JSON.parse(rawdata);
    let list = parsed.users;
    list.sort((a, b) => (a.pinged > b.pinged) ? 1 : -1);
    for (var i = 0; i < ((list.length < 10) ? list.length : 10); i++) {
      if (i == 0) {
        msgembed.addField('#' + (i + 1), '🥇<@!' + list[list.length - i - 1].discordid + '> ' + ((list[list.length - i - 1].discordid === creatorid) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings');
      }
      else if (i == 1) {
        msgembed.addField('#' + (i + 1), '🥈<@!' + list[list.length - i - 1].discordid + '> ' + ((list[list.length - i - 1].discordid === creatorid) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings');
      }
      else if (i == 2) {
        msgembed.addField('#' + (i + 1), '🥉<@!' + list[list.length - i - 1].discordid + '> ' + ((list[list.length - i - 1].discordid === creatorid) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings');
      }
      else {
        msgembed.addField('#' + (i + 1), '🏅<@!' + list[list.length - i - 1].discordid + '> ' + ((list[list.length - i - 1].discordid === creatorid) ? '**(👑 bot creator)**' : '') + ': ' + list[list.length - i - 1].pinged + ' pings');
      }
    }
    msgembed.addField("\u200B", 'Out of ' + list.length + ' ranked users').addField("\u200B", "\u200B")
    msg.channel.send(msgembed);
  }
  else if (msg.content === prefix + 'privacy') {
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
  else if (msg.content.startsWith(prefix + 'grank')) {
    let rawdata = fs.readFileSync('globalLeaderboard.json');
    let parsed = JSON.parse(rawdata);
    let list = parsed.users;
    list.sort((a, b) => (a.pinged > b.pinged) ? 1 : -1);
    const msgembed = new Discord.MessageEmbed()
      .setColor(13833)
      .setAuthor(client.user.username, client.user.avatarURL())
      .setTitle('Global Ping Leaderboard Rank Information')
      .setDescription("Shows your global rank, to show someone else's rank, append a ping to the command")
      .addField("\u200B", "\u200B")
      .setTimestamp()
      .setFooter("Someone Bot By ApocalypseCalculator - Licensed", client.user.avatarURL());
    if (msg.mentions.members.size > 1) {
      msg.channel.send('Bro please mention one user you want to check pings for');
    }
    else if (msg.mentions.members.size == 0) {
      const botuser = (element) => element.discordid === msg.author.id;
      var x = list.findIndex(botuser);
      if (x != -1) {
        msgembed.addField('Rank info', '<@!' + msg.author.id + '> is ranked **#' + (list.length - x) + '** globally for pings received').addField("\u200B", "\u200B")
        msg.channel.send(msgembed);
      }
      else {
        msgembed.addField('Rank info', '<@!' + msg.author.id + '> is not ranked').addField("\u200B", "\u200B")
        msg.channel.send(msgembed);
      }
    }
    else {
      const botuser = (element) => element.discordid === msg.mentions.users.first().id;
      var x = list.findIndex(botuser);
      if (x != -1) {
        msgembed.addField('Ping Count', '<@!' + msg.mentions.users.first().id + '> is ranked **#' + (list.length - x) + '** globally for pings received').addField("\u200B", "\u200B")
        msg.channel.send(msgembed);
      }
      else {
        msgembed.addField('Ping Count', '<@!' + msg.mentions.users.first().id + '> is not ranked').addField("\u200B", "\u200B")
        msg.channel.send(msgembed);
      }
    }
  }
  else if (msg.content.startsWith(`${prefix}fake`)) {
    if (msg.mentions.users.size > 0 || msg.mentions.roles.size > 0 || msg.mentions.everyone) {
      msg.reply('Ahem I will not ping in a fake message');
    }
    else if (msg.content.split(' ').length <= 1) {
      msg.reply('Yo you need to give me a message');
    }
    else {
      let targetmsg = msg.content.slice(`${prefix}fake`.length);
      let members = [];
      var amount = 0;
      msg.guild.members.cache.forEach((member, key) => {
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
        msg.channel.send('There was an error with making the fake message. This is usually caused by missing permissions. Please grant me either admin or manage webhook + manage messages permissions for this channel. You can contact <@492079026089885708> if this problem persists');
      });
    }
  }
  else if (msg.content.startsWith(`${prefix}block`)) {
    if (msg.member.hasPermission('ADMINISTRATOR')) {
      let raw = fs.readFileSync('./blocked.json');
      let parsed = JSON.parse(raw);
      if (msg.mentions.channels.size == 1) {
        if (parsed.blocked.includes(msg.mentions.channels.first().id)) {
          parsed.blocked = removeFromArray(parsed.blocked, msg.mentions.channels.first().id);
          let newraw = JSON.stringify(parsed);
          fs.writeFileSync('./blocked.json', newraw);
          msg.channel.send('Channel re-enabled for @someone pings :D');
        }
        else {
          parsed.blocked.push(msg.mentions.channels.first().id);
          let newraw = JSON.stringify(parsed);
          fs.writeFileSync('./blocked.json', newraw);
          msg.channel.send('Channel disabled for @someone pings D:');
        }
      }
      else {
        msg.channel.send('Please mention a channel to disable/re-enable');
      }
    }
    else {
      msg.channel.send('Only admins can use this command >:(');
    }
  }
})

function getrandomuserid(msg) {
  var server = msg.guild;
  let members = [];
  var amount = 0;
  server.members.cache.forEach((member, key) => {
    if (!member.user.bot && member != msg.member) {
      if (msg.channel.permissionsFor(member).has('VIEW_CHANNEL') && msg.channel.permissionsFor(member).has('READ_MESSAGE_HISTORY')) {
        members.push(key);
        amount++;
      }
    }
  })
  var randomn = Math.round((amount - 1) * Math.random());
  var id = members[randomn];
  console.log('returned id: ' + id + '\t server: ' + msg.guild.id);
  return id;
}

function usercount(msg) {
  var server = msg.guild;
  let members = [];
  var amount = 0;
  server.members.cache.forEach((member, key) => {
    if (!member.user.bot && member != msg.member) {
      if (msg.channel.permissionsFor(member).has('VIEW_CHANNEL') && msg.channel.permissionsFor(member).has('READ_MESSAGE_HISTORY')) {
        members.push(key);
        amount++;
      }
    }
  })
  return amount;
}

function addtoLeaderboard(id) {
  let rawdata = fs.readFileSync('globalLeaderboard.json');
  let parsed = JSON.parse(rawdata);
  const botuser = (element) => element.discordid === id;
  var x = parsed.users.findIndex(botuser);
  if (x == -1) {
    let newuser = {
      discordid: id,
      pinged: 1
    }
    parsed.users.push(newuser);
  }
  else {
    parsed.users[x].pinged++;
  }
  let newdata = JSON.stringify(parsed);
  fs.writeFileSync('globalLeaderboard.json', newdata);
}

function removeFromArray(arr, target) {
  let newarr = [];
  arr.forEach(e => {
    if (e != target) {
      newarr.push(e);
    }
  });
  return newarr;
}

function isDisabled(id) {
  let raw = fs.readFileSync('./blocked.json');
  let parsed = JSON.parse(raw);
  return parsed.blocked.includes(id);
}

client.on('reconnecting', () => {
  reconnectcount++;
});

client.on('disconnect', () => {
  console.log('bot disconnected. Offline');
});

client.on('error', error => {
  console.log(error);
});

client.login(token);
