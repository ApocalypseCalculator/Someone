const sleaderboard = require('./sleaderboard');

exports.name = 'slb';
exports.verify = function (msg) {
    return sleaderboard.verify(msg);
}

exports.execute = function (msg, args, client) {
    sleaderboard.execute(msg, args, client);
}