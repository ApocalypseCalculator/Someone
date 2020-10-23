const commands = require('./commands');

exports.name = 'cmd';
exports.verify = function (msg) {
    return commands.verify(msg);
}

exports.execute = function (msg, args, client) {
    commands.execute(msg, args, client);
}