const fs = require('fs');
const config = require('../data/config');

exports.getrandomuserid = function (msg) {
    var server = msg.guild;
    let members = [];
    var amount = 0;
    server.members.cache.forEach((member, key) => {
        if (!member.user.bot && member != msg.member) {
            if (msg.channel.permissionsFor(member).has('VIEW_CHANNEL') && msg.channel.permissionsFor(member).has('READ_MESSAGE_HISTORY')) {
                members.push(key);
                amount++;
            }
        }
    })
    var randomn = Math.round((amount - 1) * Math.random());
    var id = members[randomn];
    console.log('returned id: ' + id + '\t server: ' + msg.guild.id);
    return id;
}

exports.usercount = function(msg) {
    let memberss = [];
    var amount = 0;
    msg.guild.members.fetch().then(members => {
        members.forEach((member, key) => {
            if (!member.user.bot && member != msg.member) {
                if (msg.channel.permissionsFor(member).has('VIEW_CHANNEL') && msg.channel.permissionsFor(member).has('READ_MESSAGE_HISTORY')) {
                    memberss.push(key);
                    amount++;
                }
            }
        });
        return amount;
    }).catch(error => {return 0});
}

exports.addtoLeaderboard = function(id) {
    let rawdata = fs.readFileSync('./data/globalLeaderboard.json');
    let parsed = JSON.parse(rawdata);
    const botuser = (element) => element.discordid === id;
    var x = parsed.users.findIndex(botuser);
    if (x == -1) {
        let newuser = {
            discordid: id,
            pinged: 1
        }
        parsed.users.push(newuser);
    }
    else {
        parsed.users[x].pinged++;
    }
    let newdata = JSON.stringify(parsed);
    fs.writeFileSync('./data/globalLeaderboard.json', newdata);
}

exports.removeFromArray = function(arr, target) {
    let newarr = [];
    arr.forEach(e => {
        if (e != target) {
            newarr.push(e);
        }
    });
    return newarr;
}

exports.isDisabled = function(id) {
    let raw = fs.readFileSync('./data/blocked.json');
    let parsed = JSON.parse(raw);
    return parsed.blocked.includes(id);
}

exports.canPing = function(id) {
    let raw = fs.readFileSync('./data/pingtime.json');
    let parsed = JSON.parse(raw);
    var pos = getElementByProperty(parsed.users, 'discordid', id);
    if(pos == -1){
        return true;
    }
    else{
        if(parsed.users[pos].lastping > Date.now() - config.pingcooldown){
            return false;
        }
        else{
            return true;
        }
    }
}

exports.usedPing = function(id){
    let raw = fs.readFileSync('./data/pingtime.json');
    let parsed = JSON.parse(raw);
    var pos = getElementByProperty(parsed.users, 'discordid', id);
    if(pos == -1){
        let newobj = {
            discordid: id,
            lastping: Date.now()
        }
        parsed.users.push(newobj);
    }
    else{
        parsed.users[pos].lastping = Date.now();
    }
    let newraw = JSON.stringify(parsed);
    fs.writeFileSync('./data/pingtime.json', newraw);
}

function getElementByProperty(array, targetId, targetValue) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][targetId] === targetValue) {
            return i;
        }
    }
    return -1;
}