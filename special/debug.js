const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("special/debug.json");
global.dbs.db8 = low(adapter);
const db = global.dbs.db8
db.defaults({}).write();
module.exports.run = async (message, args) => {
  if(message.author.id!=Core.ownerID)
    return message.channel.send("```ТЫ НЕ СОЗДАТЕЛЬ БОТА, БРЫСЬ```")
  if(args[1]=="true"){
    db.set(Core.ownerID,true).write();
    message.channel.send("```yaml\nГотово```")
  } else if(args[1]=="false"){
    db.set(Core.ownerID,false).write()
    message.channel.send("```yaml\nГотово```")
  } else
    return message.channel.send("При true ты не считаешься сварщиком, при false считаешься")
};
module.exports.all00 = async (message, args) => {
  if(message.owner&&db.get(Core.ownerID).value())
    message.owner=false
};
module.exports.help = {
  name: "DEBUG",
  group:"СварщикOnly",
  description: "Команда создателя бота"
};
