const config = require('../data/config');
const system = require('systeminformation');
const discord = require('discord.js');

exports.name = 'system';
exports.verify = function (msg) { return config.hostid === msg.author.id }

exports.execute = function (msg, args, client) {
    const embed = new discord.MessageEmbed();
    embed.setTitle('System Stats');
    embed.setAuthor(msg.author.username, msg.author.avatarURL());
    embed.setColor('GREEN');
    system.osInfo(os => {
        system.processes(d2 => {
            embed.addField('Basic Information', `Uptime: ${formatTime(system.time().uptime)}\nTimezone: ${system.time().timezone}\nOperating System: ${os.distro} ${os.release} ${os.arch}\nCurrent Processes: ${d2.list.length}`, true);
            system.cpu().then(data => {
                embed.addField('CPU', `Name: ${data.manufacturer} ${data.brand}\nStepping ${data.stepping}\nProcessors: ${data.processors}\nCores: ${data.cores}\nCurrent Speed: ${data.speed}\n\nCurrent Cache (L1D, L1I, L2, L3): \n${data.cache.l1d}, ${data.cache.l1i}, ${data.cache.l2}, ${data.cache.l3}`, true);
                system.mem().then(mem => {
                    embed.addField('Memory', `Total: ${Math.round(mem.total / (1024 * 1024 * 1024) * 100) / 100}GB\nFree: ${Math.round(mem.free / (1024 * 1024 * 1024) * 100) / 100}GB\nUsed: ${Math.round(mem.used / (1024 * 1024 * 1024) * 100) / 100}GB\nBuffered Cache: ${Math.round(mem.buffcache / (1024 * 1024) * 100) / 100}MB`, true);
                    msg.channel.send(embed);
                })
            })
        })
    }).catch(err => msg.channel.send('Error occurred'));
}

function formatTime(num) {
    let left = num;
    let days = parseInt(Math.floor(num / (60 * 60.0 * 24)));
    left -= (days * 60 * 60 * 24);
    let hours = parseInt(Math.floor(left / (60 * 60.0)));
    left -= (hours * 60 * 60);
    let minutes = parseInt(Math.floor(left / 60.0));
    left -= (minutes * 60);
    let str = `${days} days, ${hours} hours, ${minutes} minutes, ${left} seconds`;
    return str;
}