const Discord = require('discord.js');
const client = new Discord.Client();
var lastpingerid = '';
var reconnectcount = 0;

const token = require('./token'); //you can replace the require(./token) with the token string if you want
const prefix = 'someone!'; //you can change this if you like

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    status: "online",
    game: {
      name: " with your useless life",
      type: "PLAYING"
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
      message.edit(`Pong! Latency is ${Math.floor(message.createdAt - msg.createdAt)}ms. API Latency is ${Math.round(client.ping)}ms`);
    });
  }
  else if (msg.isMentioned(client.user.id) && msg.author.id === lastpingerid) {
    msg.reply('calm down with the pings dude');
  }
  else if (msg.isMentioned(client.user.id) && !msg.content.includes("\\<@")) {
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
      msg.guild.fetchMember(client.user).then(member => {
        if (usercount(msg) == 0) {
          msg.channel.send("Bruh you're the only non-bot guy who can see this channel how you gonna ping someone");
        }
        if (member.hasPermission('ADMINISTRATOR') || (member.hasPermission('MANAGE_WEBHOOKS') && member.hasPermission('MANAGE_MESSAGES'))) {
          msg.channel.createWebhook(msg.member.displayName, msg.author.avatarURL).then(webhook => {
            console.log('pinger: ' + msg.author.username + '(' + msg.author.id + ')\t content: ' + msg.content.replace('<@!' + client.user.id + '>', '(botping)'));
            if (msg.content.includes('<@!' + client.user.id + '>')) {
              webhook.send(msg.content.replace('<@!' + client.user.id + '>', '<@!' + getrandomuserid(msg) + '>'));
            }
            else {
              webhook.send(msg.content.replace('<@' + client.user.id + '>', '<@!' + getrandomuserid(msg) + '>'));
            }
            webhook.delete();
            msg.delete(0);
            lastpingerid = msg.author.id;
          }).catch(error => {
            console.log(error);
            msg.channel.send('There was an error with performing the random ping. This is usually caused by missing permissions. Please grant me either admin or manage webhook + manage messages permissions for this channel. You can contact <@492079026089885708> if this problem persists');
          });
        }
        else {
          msg.channel.send('Insufficient permissions. Please either grant me admin or give me both manage webhooks and manage messages');
          const embed = new Discord.RichEmbed()
            .setColor(13833)
            .setAuthor(client.user.username, client.user.avatarURL)
            .setTitle('Permissions Demo')
            .setImage('https://cdn.discordapp.com/attachments/711370772114833520/711620022669148180/demo3.gif')
            .setTimestamp()
            .setFooter("Someone Bot By ApocalypseCalculator - Under MIT License", client.user.avatarURL);
          msg.channel.send(embed);
        }
      })
    }
  }
  else if (msg.isMentioned(client.user.id)) {
    msg.channel.send("I see what you are doing, and I don't like it");
    console.log(msg.author.username + '\t(failed ping)\t: ' + msg.content);
  }
  else if (msg.content === prefix + 'help') {
    msg.reply('what, you want help? well, thats too bad, no help for you.')
  }
  else if (msg.content === prefix + 'webhookclear' && msg.member.hasPermission('ADMINISTRATOR')) {
    msg.channel.fetchWebhooks().then(hooks => {
      hooks.forEach(hook => {
        msg.guild.fetchMembers().then(members => members.forEach(member => {
          if (member.displayName === hook.name) {
            hook.delete();
          }
        }))
      })
    }).catch(error => {
      console.log(error);
      msg.channel.send('Error on clearing webhooks. Try again or contact <@492079026089885708> if this problem persists');
    });
    msg.channel.send('webhooks cleared');
  }
  else if (msg.content === prefix + 'info') {
    const msgembed = new Discord.RichEmbed()
      .setColor(13833)
      .setAuthor(client.user.username, client.user.avatarURL)
      .setTitle('Information About Someone Bot')
      .setDescription("whats up. I am the annoying pinger bot called Someone. Developed by <@492079026089885708>. To use my annoying feature, simply ping me. These are the other commands of this wonderful Someone bot")
      .addBlankField()
      .addField('Ping Command', prefix + 'ping', true)
      .addField('Webhook Clearing Command', prefix + 'webhookclear', true)
      .addField('Troll Command', prefix + 'help', true)
      .addField('Reconnect Count Since Last Reboot', prefix + 'discordbad', true)
      .addField('Experimental Ping Contest Command', prefix + 'pingcontest (not available yet)', true)
      .addBlankField()
      .addField('Server Count', client.guilds.size, true)
      .addField('Bot List Links', '[top.gg](https://top.gg/bot/705135432588853288)', true)
      .addField('Vote Links', '[top.gg](https://top.gg/bot/705135432588853288/vote)', true)
      .addField('Invite Links', '[admin](https://discord.com/api/oauth2/authorize?client_id=705135432588853288&permissions=8&scope=bot) or [webhooks & msgs](https://discord.com/api/oauth2/authorize?client_id=705135432588853288&permissions=536879104&scope=bot)', true)
      .addField('Support Discord Server', '[Someone Support](https://discord.gg/5WmPnYx)', true)
      .addBlankField()
      .setTimestamp()
      .setFooter("Someone Bot By ApocalypseCalculator - Under MIT License", client.user.avatarURL);
    msg.channel.send(msgembed);
  }
  else if (msg.content === prefix + 'discordbad') {
    msg.channel.send('Discord API is fucking trash. I had to reconnect ' + reconnectcount + ' times since my last reboot because Discord is fucking stoopid');
  }
})

function getrandomuserid(msg) {
  var server = msg.guild;
  let members = [];
  var amount = 0;
  server.members.forEach((member, key) => {
    if (!member.user.bot && member != msg.member) {
      if (msg.channel.permissionsFor(member).has('READ_MESSAGES')) {
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
  server.members.forEach((member, key) => {
    if (!member.user.bot && member != msg.member) {
      if (msg.channel.permissionsFor(member).has('READ_MESSAGES')) {
        members.push(key);
        amount++;
      }
    }
  })
  return amount;
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
