const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("special/blacklist.json");
const db = low(adapter);
global.dbs.db9 = db
db.defaults({}).write();
module.exports.run = async (message, args) => {
  let actualOwner = message.author.id==Core.ownerID;
  if(!actualOwner)
    return message.channel.send("```ТЫ НЕ СОЗДАТЕЛЬ БОТА, БРЫСЬ```")
  let command = args.shift()
  if(args[1])args[1]=args[1].replace(/[<>@#!$%^]/g,"")
  if(args[0]=="add"){
    if(!args[1])
      return message.channel.send("А де ID либо упоминание?")
    db.set(args[1],true).write()
    message.channel.send("✅")
  } else if(args[0]=="remove"){
    if(!args[1])
      return message.channel.send("А де ID либо упоминание?")
    db.unset(args[1]).write()
    message.channel.send("✅")
  } else
    message.channel.send("```yaml\nadd для добавления, remove для удаления из ЧС```")
};
module.exports.all0 = async (message, args) => {
  if(db.get(message.author.id).value()&&!(!dbs.db8.get(Core.ownerID).value()&&message.author.id==Core.ownerID)){
    global.disabled=Core.Lib.arrayKeysObject(Core.client.commands.map((v,k)=>k))
    if(message.content.startsWith(prefix))
      message.channel.send("```Ты в черном списке бота```")
  }
};
module.exports.help = {
  group:"СварщикOnly",
  name: "BlackList",
  description: "Команда создателя бота"
};
