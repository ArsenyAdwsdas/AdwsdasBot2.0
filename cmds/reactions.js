module.exports.onMessageDM = async (message, args) => {
  const Discord=Core.Discord,
    client=Core.client
  if (!message.guild && message.owner && global.reply_to && args[0]=="say") {
    let temp = message.content.split(" ")
    temp.shift()
    global.reply_to.channel.send(temp.join(" "));
  } else if (!message.guild && message.owner && global.reply_to && args[0]=="reply") {
    let temp = message.content.split(" ")
    temp.shift()
    let to_add = {};
    if (temp.join(" ") == "ban")
      to_add[temp[0].toLowerCase()] = 1;
    else
      to_add[global.reply_to_content.toLowerCase()] = temp.join(" ");
    if (temp.join(" ") == "ban")
      global.db.set("ban-words." + global.reply_to_content.toLowerCase(), 1).write();
    else {
      global.db.set("messages." + global.reply_to_content.toLowerCase(), temp.join(" ")).write();
      global.reply_to.channel.send(temp.join(" "));
    }
  }
}
module.exports.onMessage = async (message, args) => {
  if((message.content.includes(`https://cdn.discordapp.com/attachments/405946397607591936/417960183675879424/m2.png`)
     || message.content.includes(`https://cdn.discordapp.com/attachments/405946397607591936/417960197760352257/m3.png`))
     &&
     message.channel.id!='644212839661305866'){
      message.reply("НЕ НАДЕЙСЯ")
      message.delete()
    }
  const Discord=Core.Discord,
    client=Core.client
  let args2=args.slice()
  args=args2.slice(1)
  if (message.content.startsWith("/summon")) {
    let isSummonAllowed = global.db4.get("summon." + message.author.id).value();
    if (isSummonAllowed) {
      if (args[0]) {
        message.channel.send("О <@" + args.toString().replace(/,/g, " ") + "> <@" + args.toString().replace(/,/g, " ") + "> <@" + args.toString().replace(/,/g, " ") + "> <@" + args.toString().replace(/,/g, " ") + "> <@" + args.toString().replace(/,/g, " ") + "> ПРИЗЫВАЮ ТЕБЯ");
        global.summon_user = args[0].replaceAll(/[\\<>@#&!]/g, "");
        global.summon_channel = message.channel.id;
        global.summon_complete = false;
      } else
        message.channel.send("\\*" + message.author + " не знает кого призвать...*");
    } else
      message.channel.send("ТЕБЕ НЕЗЯ!");
  }
  if (message.content.startsWith("./me")) {
    if (args[0])
      message.channel.send("\\*" + message.author + " " + args.join(" ") + "*");
    else
      message.channel.send("\\*" + message.author + " не знает что делать*");
    message.delete();
  }
  if (message.content.startsWith("/kill")) {
    if (message.mentions.users.first())
      message.channel.send("\\*" + message.mentions.users.first() + " выпал из мира*\nhttps://media.discordapp.net/attachments/387531520811859970/686562938789822468/RaphaelDeath.gif");
    else if (message.content.startsWith("/kill @e"))
      message.channel.send("ВСЕ ЖИВОЕ БЫЛО СТЕРТО ИЗ СУЩЕСТВОВАНИЯ\nhttps://media.discordapp.net/attachments/387531520811859970/686562938789822468/RaphaelDeath.gif");
    else
      message.channel.send("\\*" + message.author + " выпал из мира*")
  }
  if (message.content.startsWith("EMBED") && message.owner) {
    let color = args.shift();
    let my_embed = new Discord.RichEmbed();
    my_embed.setAuthor(message.author.username, message.author.avatarURL);
    message.delete();
    my_embed.setDescription(args.join(" "));
    my_embed.setTimestamp(global.now);
    my_embed.setColor(color);
    message.channel.send(my_embed);
  }
  if (message.content.toLowerCase().startsWith("спасибо бот")) {
    if (message.owner)
      message.channel.send("Не за что)");
    else
      message.channel.send("Не за что)");
  }
  if (message.content.toLowerCase().startsWith(Core.botUsername.toLowerCase() + ", мы уходим") && message.owner) {
    message.channel.send("```yaml\nМне все-равно не нравился этот сервер```");
    message.member.kick();
    message.guild.leave();
  }
  if (message.content.startsWith("ААА БЛ#ТЬ") && message.owner) {
    message.channel.send("```yaml\nУспокойся...```");
  }
  if (message.content.startsWith(Core.client.user.username) || (message.mentions.users.first() && message.mentions.users.first().id == Core.client.user.id) || (message.mentions.roles.first() &&message.mentions.roles.first().managed &&message.mentions.roles.first().name == Core.client.user.username)) {
    let reply = "null";
    let content = message.content.replace(/[\\<>@#&!*]/g, "").replace(/\./g, "*,*");
    content = content.replace("\\s+", " ");
    if (message.mentions.roles.first())
      content = content.replace(message.mentions.roles.first().id,Core.client.user.username);
    if (message.mentions.users.first())
      content = content.replace(Core.client.user.id, Core.client.user.username);
    let ban = false
    if (reply && reply.includes("Creator"))
      reply = reply.replaceAll("Creator", "<@" + Core.ownerID + ">");
    console.log("``"+content.toLowerCase()+"``")
    reply = db.get("messages."+content.toLowerCase()).value()
    Object.keys(db.get("ban-words").value()).forEach((v)=>{if(new RegExp(" "+v+" ".toLowerCase()).test(content.toLowerCase()+" "))ban=true})
    if(ban===true)return
    if (reply != "nil"){
      if (reply&&reply!="null")
        message.channel.send(reply);
      else {
        global.reply_to_content = content;
        global.reply_to = message;
        Core.client.users.get(Core.ownerID).send("**channels.get('"+message.channel.id+"')**: "+ message.author + ": " + message.content);
      }
    }
  }
  if (global.summon_complete) {
    if (message.channel.id == global.summon_channel && message.author.id == global.summon_user && message.content.toLowerCase().startsWith("призыв в армию?")) {
      message.channel.send("XD");
      global.summon_user = 0;
    }
  } else {
    if (message.channel.id == global.summon_channel && message.author.id == global.summon_user) {
      message.channel.send("ПРИЗЫВ ЗАВЕРШЕН");
      global.summon_complete = true;
    }
  }
};
module.exports.help = {
  name: "BotReactions",
  hidden: true,
  description: "Куча хлама из старой версии бота всунутая в модуль",
  group: "Misc"
};
