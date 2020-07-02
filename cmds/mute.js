const low = require("lowdb"),
  FileSync = require("lowdb/adapters/FileSync"),
  adapter = new FileSync("cmds/mute.json"),
  DB = low(adapter),
  settings = {"admin": {value: "string, null", values: {"null": true, string: true}, desc: "Роль ВСЕГДА имеющая право мутить"}};
DB.defaults({}).write()
const helpText = "member <ID либо упоминание кого мутить> <время в секундах, необязательно>\nsettings <настройка> <значение>\nsettings help\nsettings list";
function help(message) {
  return new Core.Discord.RichEmbed()
    .setColor("2ecc71")
    .setTitle("Мут")
    .setFooter(`${Core.client.user.username} ` + version + " - mute")
    .addField("Список использований", helpText);
}
module.exports.run = async (message, args) => {
  const Discord=Core.Discord
  const client=Core.client
  if (!message.guild.me.hasPermission("MANAGE_ROLES") && !message.guild.me.hasPermission("ADMINISTRATOR")) return message.reply("Я не могу мутить");
  let muteRole = message.guild.roles.find(r=>r.name=="Adwsdas-MUTE")
  if(!muteRole&&!message.guild.me.hasPermission("MANAGE_ROLES"))return message.reply("Роли **Adwsdas-MUTE** не существует и я не могу ее создать и настроить");
  if(!muteRole){
    await message.guild.createRole({name: "Adwsdas-MUTE", permissions:0}).then(created => {muteRole=created}).catch(console.log);
    let channels = message.guild.channels.array()
    Object.keys(channels).forEach(k=>{
      channels[k].overwritePermissions(muteRole,{SEND_MESSAGES: false})
    })
  }
  if ((muteRole.comparePositionTo(message.guild.me.highestRole) >=0)) return message.reply("Роль мута выше меня");
  let command = args.shift()
  let server_owner = false;
  if (message.guild.owner.user.id == message.author.id) server_owner = true;
  if (!message.guild.me.hasPermission("ADMINISTRATOR")) return message.reply("Я не управлять ролями, данный модуль требует право администратора, но его у меня нету");
  if (message.mentions.roles.first()&&!(message.guild.me.highestRole.comparePositionTo(message.mentions.roles.first()) >=0)) return message.reply("Данная роль выше меня");
  let admin = false
  if(message.member.roles.find(r=>r.id==Core.Lib.settings.get("admin", DB, message.guild.id)))
    admin = true
  if (!message.member.hasPermission(["ADMINISTRATOR"], {checkAdmin: true,checkOwner: true}) && !message.owner && !admin)
    return message.reply("Ты не имеешь права `Администратор`");
  if (command == "help") 
    message.send(help(message));
  else if(command == "settings") {
    command = args.shift()
    if(command=="help")
      message.channel.send(Core.Lib.settings.help());
    else if(command=="list")
      message.channel.send(Core.Lib.settings.list(settings));
    else
      message.channel.send(Core.Lib.settings.set(settings, command, message, args, DB))
  } else if (command == "member") {
    let member = args[0]
    if(!member)return message.channel.send("Мембер не найден")
    member = member.replace(/[<>@!#$%^&*]/g,"")
    member = message.guild.members.get(member)
    if(!member)return message.channel.send("Мембер не найден")
    let time = parseInt(args[1])
    if(!member.roles.get(muteRole.id))member.addRole(muteRole)
    message.channel.send("АЙ БЛ#! Замутили чолодые моловеки <@"+message.mentions.members.first().id+"> на "+time+" секунд");
    if(!isNaN(time))setTimeout(() => {member.removeRole(muteRole).then().catch()}, time*1000)
  } else message.reply("Непонятно что делать, пропиши"+prefix+"mute help");
};

module.exports.help = {
  regexp: ["[mMмМ][uUyYуУьЬ][tTтТюЮ][tTeEеЕтТ]","[mMмМ][yYуУ][tTтТ]"],
  name: "mute",
  description: "Мут...",
  example: "help",
  group: "Admin",
  settings: true
};
