exports.name = 'whclear'
exports.verify = function (msg) {
  return msg.member.hasPermission('MANAGE_WEBHOOKS')
}
exports.execute = function (msg) {
  msg.channel.fetchWebhooks().then(hooks => {
    hooks.forEach(hook => {
      hook.delete(`Webhook clearing command run by ${msg.author.tag}`)
    })
  }).catch(error => {
    console.log(error)
    msg.channel.send(`Error on clearing webhooks. Try again or contact the bot creator in the support server if this problem persists (server invite with \`${prefix}info\` command)`)
  })
  msg.channel.send('webhooks cleared')
}
