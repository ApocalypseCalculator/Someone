const pingcount = require('./pingcount');

exports.name = 'pc';
exports.verify = function (msg) {
    return pingcount.verify(msg);
}

exports.execute = function (msg, args, client) {
    pingcount.execute(msg, args, client);
}