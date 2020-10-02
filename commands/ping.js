exports.name = 'ping'
exports.verify = function (msg) {
  return true
}

exports.execute = function (msg, args, client) {
  const message = msg.reply('poooong').then((message) => {
    message.edit(`Pong! Latency is ${Math.floor(message.createdAt - msg.createdAt)}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
  })
}
