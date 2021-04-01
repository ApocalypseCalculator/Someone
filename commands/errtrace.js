const config = require('../data/config');
const fs = require('fs');

exports.name = 'errtrace';
exports.verify = function (msg) {
    return config.hostid === msg.author.id;
}

exports.execute = function (msg, args, client) {
    if (args[0]) {
        let raw = fs.readFileSync('./data/err.json');
        let parsed = JSON.parse(raw);
        let errs = parsed.filter(p => p.id === args[0]);
        if (errs.length == 0) {
            msg.channel.send('No error with ID found.');
        }
        else {
            msg.channel.send(`\`\`\`Error: ${errs[0].err}\nID: ${errs[0].id}\nTime: ${new Date(errs[0].time).toUTCString()}\nServer: ${errs[0].server}\nUser: ${errs[0].user}\nCommand: ${errs[0].command}\`\`\``);
        }
    }
}