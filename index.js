const Discord = require('discord.js');
const client = new Discord.Client();
var lastpingerid = '';

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
  else if (msg.isMentioned(client.user.id) && !msg.author.bot) {
    msg.channel.createWebhook(msg.member.displayName, msg.author.avatarURL).then(webhook => {
      console.log('pinger: ' + msg.author.username + '(' + msg.author.id + ')\t content: ' + msg.content.replace('<@!' + client.user.id + '>', '(botping)'));
      webhook.send(msg.content.replace(client.user.id, getrandomuserid(msg)));
      webhook.delete();
      msg.delete(0);
      lastpingerid = msg.author.id;
    }).catch(error => console.log(error));
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
    }).catch(console.error);
    msg.channel.send('webhooks cleared');
  }
  else if (msg.content === prefix + 'info') {
    msg.channel.send({
      embed: {
        color: 13833,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: 'Commands List',
        description: "whats up. I am the annoying pinger bot called Someone. Developed by ApocalypseCalculator. To use my annoying feature, simply ping me. These are the other commands of this wonderful Someone bot",
        fields: [{
          name: 'Ping Command',
          value: prefix + "ping"
        }, {
          name: 'Webhook Clearing Command',
          value: prefix + "webhookclear"
        }, {
          name: 'Troll Command',
          value: prefix + 'help'
        }, {
          name: '',
          value: ''
        }, {
          name: 'Server Count: ',
          value: client.guilds.size
        }],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "Someone Bot By ApocalypseCalculator - Under MIT License"
        }
      }
    });
  }
})

function getrandomuserid(msg) {
  var server = msg.guild;
  let members = [msg.author.id];
  var amount = 0;
  server.members.forEach((member, key) => {
    if (!member.user.bot) {
      members.push(key);
      amount++;
    }
  })
  var randomn = Math.round((amount - 1) * Math.random());
  var id = members[randomn];
  console.log('returned id: ' + id);
  return id;
}

client.login(token);
