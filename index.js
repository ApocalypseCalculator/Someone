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
    msg.guild.fetchMember(client.user).then(member => {
      if(member.hasPermission('ADMINISTRATOR') || (member.hasPermission('MANAGE_WEBHOOKS') && member.hasPermission('MANAGE_MESSAGES'))){
        msg.channel.createWebhook(msg.member.displayName, msg.author.avatarURL).then(webhook => {
          console.log('pinger: ' + msg.author.username + '(' + msg.author.id + ')\t content: ' + msg.content.replace('<@!' + client.user.id + '>', '(botping)'));
          webhook.send(msg.content.replace(client.user.id, getrandomuserid(msg)));
          webhook.delete();
          msg.delete(0);
          lastpingerid = msg.author.id;
        }).catch(error => {
          console.log(error);
          msg.channel.send('There was an error with performing the random ping. This is usually caused by missing permissions. Please grant me either admin or manage webhook + manage messages permissions for this channel. You can contact <@492079026089885708> if this problem persists');
        });
      }
      else{
        msg.channel.send('Insufficient permissions. Please either grant me admin or give me both manage webhooks and manage messages');
      }
    })
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
      .addField('Experimental Ping Contest Command', prefix + 'pingcontest (not available yet)', true)
      .addBlankField()
      .addField('Server Count: ', client.guilds.size)
      .setTimestamp()
      .setFooter("Someone Bot By ApocalypseCalculator - Under MIT License", client.user.avatarURL);
    msg.channel.send(msgembed);
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
  console.log('returned id: ' + id + '\t server: ' + msg.guild.id);
  return id;
}

client.login(token);
