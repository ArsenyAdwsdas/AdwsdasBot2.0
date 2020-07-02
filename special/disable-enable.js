const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("special/disable-enable.json");
const DB = low(adapter);
DB.defaults({}).write();
module.exports.run = async (message, args) => {
  let server_owner = false;
  if (message.guild.owner.user.id == message.author.id)
    server_owner = true;
  else if (message.owner)
      server_owner = true;
  if (!server_owner)return message.channel.send("```Ты не владелец сервера```");
  let now = new Date().getTime(),
    command = args[1];
  if (!args[1])
    return message.channel.send("```enable для включения модуля, disable для отключения```");
  if (!args[2])
    return message.channel.send("```Модуль не найден```");
  if (command == "enable") {
    if (Core.client.commands.get(args[2])) {
      if (DB.get(message.guild.id + "." + args[2]).value()) {
        DB.set(message.guild.id + "." + args[2],false).write();
        message.channel.send("```Модуль " + args[2] + " включен на сервере```");
      } else return message.channel.send("```Модуль уже включен```");
    } else return message.channel.send("```Модуль не найден```");
  } else if (command == "disable") {
    if (Core.client.commands.get(args[2])) {
      if (!DB.has(message.guild.id + "." + args[2]).value()) {
        DB.set(message.guild.id + "." + args[2], true).write();
        message.channel.send(
          "```Модуль " + args[2] + " отключен на сервере```"
        );
      } else
        return message.channel.send("```Модуль уже отключен```");
    } else
      return message.channel.send("```Модуль не найден```");
  } else
    message.channel.send("```enable для включения модуля, disable для отключения```");
};
module.exports.all = (message, args) => {
  if(!message||!message.guild)
    return
  const defaultDisable = {purge: true}
  Core.client.groups.modules.Stupid.grouped.map((v, k) => k).forEach(k=>{
    defaultDisable[k]=true
  })
  if(!DB.has(message.guild.id).value())
    DB.set(message.guild.id, defaultDisable).write();
  if(message.owner)
    return;
  let z = DB.get(message.guild.id).value();
  clear(z)
  extend(global.disabled, z);
  if(!message.content.startsWith(prefix)&&!message.content.startsWith(prefix2))return
  if (message && !message.content.includes("[") && !message.content.includes("]") && !message.content.includes("{") && !message.content.includes("}")) {
    if (DB.has(message.guild.id +"." +message.content.slice(prefix.length).split(" ")[0]).value()) {
      message.content = "";
      args = [];
      message.channel.send("```МОДУЛЬ ОТКЛЮЧЕН НА СЕРВЕРЕ```");
    }
  }
};
function extend(a, b) {
  Object.keys(b).forEach(function(key) {
    a[key] = b[key];
  });
}
module.exports.help = {
  name: "MODULES",
  description: "Включение-Выключение модулей",
  example: "<enable/disable> <название модуля>"
};
function clear(z){
  Object.keys(z).forEach(k=>{
    if(z[k]==false)
      delete z[k]
  })
  return z
}