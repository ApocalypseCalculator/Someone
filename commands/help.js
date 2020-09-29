const config = require('../data/config')

exports.name = 'help';
exports.verify = function (msg) {
    return true;
}

exports.execute = function (msg, args, client) {
    msg.reply(`Do ${config.prefix}info for my information page and \`${config.prefix}commands\` for my commands list`);
}
