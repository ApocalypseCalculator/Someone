const Discord = require('discord.js');
const fs = require('fs');

exports.name = 'sblocked';
exports.verify = function (msg) {
    return true;
}

exports.execute = function (msg, args, client) {
    let rawdata = fs.readFileSync('./data/blocked.json');
    let parsed = JSON.parse(rawdata);
    const embed = new Discord.MessageEmbed()
        .setColor(13833)
    let blcked = "";
    msg.guild.channels.cache.forEach(chnl => {
        if(parsed.blocked.includes(chnl.id)){
            blcked += `<#${chnl.id}> `
        }
    });
    if(blcked.length > 1900){
        msg.channel.send('Oof you have too many channels blocked in this server');
    }
    else{
        embed.addField('Blocked channels in this server', blcked);
        msg.channel.send(embed);
    }
}
