module.exports.run = async (message, args) => {
  let db5=global.dbs.db5
  if (!db5.get(message.guild.id).value()) db5.set(message.guild.id, {}).write();
  if (!args[0]) return message.channel.send("**" +prefix +"nick reset** сбросит ник, а так **" +prefix +"nick <любой текст для нового ника>**");
  let server_owner = false;
  if (message.guild.owner.user.id == message.author.id) server_owner = true
  if (args[0] != "allowed") {
    if (!message.guild.me.hasPermission("MANAGE_NICKNAMES") &&!message.guild.me.hasPermission("ADMINISTRATOR")) return message.reply("Я не могу менять ники, неть прав");
    if (!db5.get(message.guild.id + "." + message.author.id).value()) {
      if (args[0] == "reset"&&!args[1]) args[0] = "";
      try{
        message.member.setNickname(args.join(" "));
        message.channel.send("Теперь твой ник: `"+args.join(" ")+"`");
      }catch(e){message.channel.send("```js\n"+e+"```")}
    } else message.channel.send("Тебе запрещено!");
  } else {
    if (!server_owner&&!message.owner) return message.channel.send("Тебе запрещено управлять правом менять ник");
    if (!args[1]) return message.channel.send("Недостаточно аргументов, надо либо упоминание либо ID юзера и потом true или false");
    if (args[2] == "false") args[2] = false;
    if (args[2] == "true") args[2] = true;
    if (typeof args[2]==typeof "gas") return message.channel.send("false для запрета, true для разрешения");
    args[1]=args[1].replace(/[<>@#$!%^&*()]/g,"")
    if (!message.guild.members.get(args[1])) return message.channel.send("Юзер не найден");
    if (args[2]) {
      if(!db5.has(message.guild.id + "." + args[1]).value())return message.channel.send(args[1] + " и так разрешено менять ник");
      db5.unset(message.guild.id + "." + args[1]).write();
      message.channel.send(args[1] + " разрешено менять ник");
    } else {
      if(db5.has(message.guild.id + "." + args[1]).value())return message.channel.send(args[1] + " и так запрещено менять ник");
      db5.set(message.guild.id + "." + args[1], true).write();
      message.channel.send(args[1] + " запрещено менять ник");
    }
  }
};
module.exports.help = {
  regexp: ["[hHнНnN][nNиИ][cCсС][kKкК]","[hHнНnN][nNиИ][kKкК]"],
  name: "nick",
  description: "Vlad_Hello)))",
  example: "",
  group: "Misc"
};
