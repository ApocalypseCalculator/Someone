const Discord = require('discord.js');
const AED = require('./server');

const client = new Discord.Client();
const token = require('./token');
var lastpingerid = '';

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

client.on('message', msg =>{
  if(msg.author.id === client.user.id){
    return;
  }
  else if(msg.content === 'someone!ping'){
    const message = msg.reply('poooong').then((message) => {
        message.edit(`Pong! Latency is ${Math.floor(message.createdAt - msg.createdAt)}ms. API Latency is ${Math.round(client.ping)}ms`);
    });
  }
  else if(msg.isMentioned(client.user.id) && msg.author.id === lastpingerid){
    msg.reply('calm down with the pings dude');
  }
  else if(msg.isMentioned(client.user.id) && !msg.author.bot){
    msg.channel.createWebhook(msg.member.displayName,msg.author.avatarURL).then(webhook =>{
      console.log('pinger: ' + msg.author.username);
      webhook.send('<@' + getrandomuserid(msg) + '>');
      webhook.delete();
      msg.delete(0);
      lastpingerid = msg.author.id;
    }).catch(error => console.log(error));
  }
  else if(msg.content === 'someone!help'){
    msg.reply('what, you want help? well, thats too bad, no help for you.')
  }
  else if(msg.content === 'someone!webhookclear' && msg.member.hasPermission('ADMINISTRATOR')){
    msg.channel.fetchWebhooks().then(hooks => {
      hooks.forEach(hook =>{
        hook.delete();
      })
    }).catch(console.error);
    msg.channel.send('webhooks cleared');
  }
  else if(msg.content === 'someone!info'){
      msg.channel.reply('whats up. I am the annoying spam pinger bot called Someone. Developed by ApocalypseCalculator. To use my annoying feature, simply ping me.\n Other commands are: someone!ping, someone!help, someone!webhookclear');
  }
})

function getrandomuserid(msg){
  var server = msg.guild;
  let members = [msg.author.id];
  var amount = 0;
  server.members.forEach((member,key) =>{
    if(!member.user.bot){
      members.push(key);
      amount++;
    }
  })
  var randomn = Math.round((amount-1)*Math.random());
  var id = members[randomn];
  console.log('returned id: ' + id);
  return id;
}

AED();
client.login(token);
