module.exports.run = async (message, args) => {
  if(!message.owner)
    return message.channel.send("Ты не создатель бота")
  process.exit(0)
};
module.exports.runDM = async (message, args) => {
  if(!message.owner)
    return message.channel.send("Ты не создатель бота")
  process.exit(0)
};
module.exports.onMessage = async (message, args) => {
  if(message.content!="restart")
    return
  if(!message.owner)
    return
  process.exit(0)
};
module.exports.force = async (mode) => {
  if(mode=="restart")
    process.exit(0)
};
module.exports.onMessageDM = async (message, args) => {
  if(message.content!="restart")
    return
  if(!message.owner)
    return
  process.exit(0)
};
module.exports.help = {
  name: "restart",
  description: "Рестарт бота",
  hidden:true
};
