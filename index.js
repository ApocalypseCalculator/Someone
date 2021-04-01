const fs = require('fs');
const Discord = require('discord.js');
const config = require('./data/config');
const token = require('./data/token');
const client = new Discord.Client();
const base = require('./lib/helpermethods');

var commands = {};
fs.readdirSync('./commands/').forEach(function (file) {
  let m = require('./commands/' + file);
  if (m.name == null || m.execute == null || m.verify == null) {
    console.error(`\x1b[31mInvalid command: ${file}\x1b[0m`);
  }
  else if (m.name in commands) {
    console.error(`\x1b[31mDuplicate command name: ${file} (${m.name})\x1b[0m`);
  }
  else {
    commands[m.name] = m;
    console.log(`Loaded command: ${file} (${m.name})`);
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activity: {
      type: 'WATCHING',
      name: ` for ${config.prefix}help`
    },
    status: 'online'
  });
})

client.on('message', msg => {
  const args = msg.content.slice(config.prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();
  if (msg.author.id === client.user.id || msg.author.bot || msg.channel.type === 'dm') {
    return;
  }
  else if (msg.mentions.members.has(client.user.id) && !base.canPing(msg.author.id)) {
    msg.reply('calm down with the pings dude. (1 minute cooldown)');
  }
  else if (msg.mentions.members.has(client.user.id) && !msg.content.includes("\\<@")) {
    if (msg.content.includes('@everyone') || msg.content.includes('@here') || msg.mentions.roles.size > 0) {
      if (!msg.member.hasPermission('MENTION_EVERYONE')) {
        msg.channel.send("I see what you're doing, and I don't like it");
        if (config.logging) {
          console.log('attempted ping by: ' + msg.author.username + '\tcontent:\t' + msg.content);
        }
      }
      else {
        msg.channel.send("I'm going to give everyone 1 less ping by not repeating that with a Someone ping. tyvm");
        if (config.logging) {
          console.log('attempted ping by: ' + msg.author.username + '\tcontent:\t' + msg.content);
        }
      }
    }
    else {
      var usrcount = base.usercount(msg);
      if (!base.isDisabled(msg.channel.id)) {
        msg.guild.members.fetch(client.user).then(member => {
          if (usrcount <= 5) {
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
              if (config.logging) {
                console.log('pinger: ' + msg.author.username + '(' + msg.author.id + ')\t content: ' + msg.content.replace('<@!' + client.user.id + '>', '(botping)'));
              }
              var randid = base.getrandomuserid(msg);
              if (msg.content.includes('<@!' + client.user.id + '>')) {
                webhook.send(msg.content.replace('<@!' + client.user.id + '>', '<@!' + randid + '>'));
              }
              else {
                webhook.send(msg.content.replace('<@' + client.user.id + '>', '<@!' + randid + '>'));
              }
              base.addtoLeaderboard(randid);
              msg.delete();
              base.usedPing(msg.author.id);
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
  else if (msg.mentions.members.has(client.user.id)) {
    msg.channel.send("I see what you are doing, and I don't like it");
    console.log(msg.author.username + '\t(failed ping)\t: ' + msg.content);
  }
  else if (!msg.content.startsWith(config.prefix)) return;
  else if (!commands[command]) msg.channel.send('command not found');
  else if (commands[command].verify(msg)) {
    try {
      commands[command].execute(msg, args, client);
    }
    catch (err) {
      try {
        let raw = fs.readFileSync('./data/err.json');
        let parsed = JSON.parse(raw);
        let errid = Buffer.from(`${Math.random().toString(36).substring(7)}-${Date.now()}`).toString('base64');
        let newobj = {
          err: `${err}`,
          id: `${errid}`,
          time: Date.now(),
          server: msg.guild.id,
          user: msg.author.id,
          command: `${msg.content}`
        }
        parsed.push(newobj);
        let newraw = JSON.stringify(parsed);
        fs.writeFileSync('./data/err.json', newraw);
        msg.channel.send(`Fatal error occurred, error trace id is \`${errid}\`. You can take this id to the support server for help.`);
      }
      catch (err) {
        console.log(err);
        msg.channel.send('Fatal error occurred');
      }
    }
  }
  else {
    msg.channel.send('You do not have permission to use this command');
  }
});

client.on('error', error => {
  console.log(error);
});

client.login(token);