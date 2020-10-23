const gleaderboard = require('./gleaderboard');

exports.name = 'glb';
exports.verify = function (msg) {
    return gleaderboard.verify(msg);
}

exports.execute = function (msg, args, client) {
    gleaderboard.execute(msg, args, client);
}