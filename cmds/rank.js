const low = require("lowdb"),
  FileSync = require("lowdb/adapters/FileSync"),
  adapter = new FileSync("cmds/roles.json2"),
  db3BACKUP = low(adapter);
const DB = db3,
  db = db3,
  settings = {"nomsg": {value: "boolean", values: {"boolean":true}, desc: "Если true то не будет писать про новые уровни, если false то не будет"}}
  helpText = "view показывает твой (или того кого упоминаешь) уровень и опыт\ntop [число] (опциональный аргумент) показывает топ уровней на сервере\ncalс это калькулятор с 2 режимами, **calc xp <число символов> <уровень>** для подсчета сколько выйдет опыта с сообщения, **calc lvl <уровень>** для подсчета сколько надо опыта для перехода на указанный уровень с прошлого уровня ";
var args, message;
function help(message) {
  return new Core.Discord.RichEmbed()
    .setColor("2ecc71")
    .setTitle("Ранговая система")
    .setFooter(`${Core.client.user.username} ` + version + " - rank")
    .addField("Список команд", helpText);
}
const sortir = function(array0,limit) {
  if(!limit)limit=false
  let i = 1;
  let array = Object.keys(array0).map(
    (m, ind) => `${array0[m]} ***_ _ _ _-_ _ _ _*** <@${m}>`
  );
  let array1 = []
  Object.keys(array).forEach(k=>{
    if(array[k-array1.length]&&isNaN(parseInt(array[k-array1.length].split("***_ _ _ _-_ _ _ _***")[0])))array1[array1.length]=array.splice(k-array1.length,1)[0]
  })
  i = 0;
  let c1 = 0;
  while (c1 < array.length) {
    while (i < array.length - 1) {
      if (
        parseInt(array[i].split("***_ _ _ _-_ _ _ _***")[0]) <
        parseInt(array[i + 1].split("***_ _ _ _-_ _ _ _***")[0])
      ) {
        let c = array[i];
        array[i] = array[i + 1];
        array[i + 1] = c;
      } else {
      }
      i++;
    }
    i = 0;
    c1++;
  }
  Object.keys(array1).forEach(k=>{
    if(message.guild.members.get(array1[k].split("***_ _ _ _-_ _ _ _***")[1].replace(/[<>@!$#%^&*() ]/g,"")))array.unshift(array1[k])
  })
  array = array.map(
    (v, k) => `${k+1}. ${v.replace("***_ _ _ _-_ _ _ _***", "-")}`
  );
  if(limit)
    return Core.Lib.chunkStringLines(array.slice(null, limit).join("\n"), 2047);
  if(!limit)
    return Core.Lib.chunkStringLines(array.join("\n"), 2047);
};
module.exports.run = async (message0, args0) => {
  const Discord=Core.Discord,
    client=Core.client
  let server_owner = false;
  if (message0.guild.owner.user.id == message0.author.id) {
    server_owner = true;
  }
  if(!DB.has(message0.guild.id).value())DB.set(message0.guild.id,{}).write()
  let now = new Date().getTime();
  message = message0;
  args = args0;
  let guild = message.guild.id,
    command = args.shift();
  if (!command || command == "" || (command&& !isNaN(Number(command.replace(/[<>@!$%^*()]/g,""))))) {
    if(command)args[0]=command.replace(/[<>@!$%^*()]/,"")
    command = "view";
  }
  if(command == "settings") {
    command = args.shift()
    if(command=="help")
      message.channel.send(Core.Lib.settings.help());
    else if(command=="list")
      message.channel.send(Core.Lib.settings.list(settings));
    else
      message.channel.send(Core.Lib.settings.set(settings, command, message, args, DB))
  } else if (command == "help")
    return message.channel.send(help(message));
  else if (command == "calc") {
    command = args.shift();
    if (!command || command == "") return message.channel.send("Калькулятор не найден");
    if (command == "xp") {
      if (!args[1] || args[1] == "") return message.channel.send("Недостаточно аргументов");
      args[0] = Number(args[0]);
      args[1] = Number(args[1]);
      message.channel.send(`${Math.round((Math.sqrt(args[0]) / (Math.sqrt(args[1]) / 3)) * 10) / 10} опыта будет получено за ${args[0]} символов при ${args[1]} уровне`);
    } else if (command == "lvl") {
      if (!args[0] || args[0] == "") return message.channel.send("Недостаточно аргументов");
      args[0] = Number(args[0]);
      message.channel.send(`${Math.round(Math.pow(args[0] + 3, (Math.sqrt(args[0] + 3) * 3) / Math.sqrt((args[0] + 3) / 1.1)) * 10) / 10} опыта необходимо для ${args[0]} уровня`);
    } else return message.channel.send("Калькулятор не найден");
  } else if (command == "view") {
    let id = message.author.id;
    if (args[0]) id = args[0].replace(/[\\<>@#&!]/g, "");
    const my_embed = new Discord.RichEmbed().setColor("2ecc71");
    if (client.users.find(r => r.id == id)) my_embed.setAuthor(client.users.find(r => r.id == id).username, client.users.find(r => r.id == id).avatarURL);
    my_embed.setTimestamp(now);
    let lvl = db.get("level." + guild).value()[id],
      sendingText = `Уровень: ${lvl}\nОпыт: `,
      xp = db.get(`xp.${guild}`).value()[id];
    if (xp == -1) sendingText = sendingText + "NaN" + " из " + "NaN";
    else {
      if (xp + 2 == xp + "2") sendingText = `${sendingText}\`${xp}\` из NaN`;
      else sendingText = `${sendingText}${Math.round(xp * 10) / 10} из ${Math.round(Math.pow(lvl + 3, (Math.sqrt(lvl + 3) * 3) / Math.sqrt((lvl + 3) / 1.1)) * 10) /10}`
    }
    my_embed.setDescription(sendingText);
    message.channel.send(my_embed);
  } else if (command == "top") {
    if(args[0]) args[0]=Number(args[0])
    if(isNaN(args[0]))args[0]=null
    let z = sortir(db.get("level."+message.guild.id).value(),args[0]);
    Object.keys(z).forEach(k => {
      message.author.send(new Discord.RichEmbed()
      .setColor("2ecc71")
      .setThumbnail(message.guild.iconURL)
      .setDescription(z[k])
      .setTimestamp(now)
      .setTitle("Ранговая система")
      .setFooter(`${client.user.username} ` + version + " - rank"))
    });
  } else if (command == "set" && message.owner) {
    command = args.shift();
    const id = args.shift();
    guild = args.shift();
    if(!guild) return message.channel.send("Недостаточно аргументов")
    if (command == "xp")
      db.set(`xp.${guild}.${id}`, eval(args.join(" "))).write();
    else if (command == "level")
      db.set(`level.${guild}.${id}`, eval(args.join(" "))).write(); 
    else
      message.channel.send("А ПО НОРМАЛЬНОМУ ЧТО СТАВИТЬ");
  } else message.channel.send("Команда не найдена, попробуй `" + prefix + "rank help`");
};
module.exports.onMessage = async (message, args) => {
  if(Object.keys(db3.get("xp").value()).length<6){
    /*Core.client.users.get(Core.ownerID).send(`db3 СНОВА КРАШНУЛОСЬ!!!`)
    console.log(`db3 СНОВА КРАШНУЛОСЬ!!!`)
    Core.client.users.get(Core.ownerID).send(`Востановление резервной копии...`)
    console.log(`Востановление резервной копии...`)
    db3.set("level", db3BACKUP.get("level").value()).write()
    db3.set("xp", db3BACKUP.get("xp").value()).write()
    db3.set("settings", db3BACKUP.get("settings").value()).write()*/
  }
  const guild = message.guild.id
  if (db.get(`xp.${guild}.${message.author.id}`).value() == NaN) db.set(`xp.${guild}.${message.author.id}`, 1).write();
  if (!db.has(`level.${guild}.${message.author.id}`).value()) db.set(`level.${guild}.${message.author.id}`, 1).write();
  if (!db.has(`xp.${guild}.${message.author.id}`).value()) db.set(`xp.${guild}.${message.author.id}`, 1).write();
  if (db.get(`xp.${guild}.${message.author.id}`).value() > -1 && typeof db.get(`xp.${guild}.${message.author.id}`).value() != typeof "fsadfasf") {
    let level = db.get(`level.${guild}.${message.author.id}`).value(),
      xp = db.get(`xp.${guild}.${message.author.id}`).value();
    db.set(`xp.${guild}.${message.author.id}`, xp + Math.sqrt(message.content.length) / (Math.sqrt(level) / 3)).write();
    if (db.get(`xp.${guild}.${message.author.id}`).value() > -1) {
      let lvl = db.get(`level.${guild}.${message.author.id}`).value() + 3;
      if (db.get(`xp.${guild}.${message.author.id}`).value() >= Math.pow(lvl, (Math.sqrt(lvl) * 3) / Math.sqrt(lvl / 1.1))) {
        db.set(`xp.${guild}.${message.author.id}`, 1).write();
        db.set(`level.${guild}.${message.author.id}`, lvl - 2).write();
        if(!Core.Lib.settings.get("nomsg", DB, message.guild.id))
          message.channel.send(`У тебя теперь ${lvl - 2} уровень, для проверки уровня и опыта используй ${prefix}rank`);
      }
    }
  }
};
module.exports.help = {
  regexp: ["[rRpPрРг][aAаА][hHnNнН][gGkKкКгГ]","[tTтТ][aAаА][hHnNнН][kKкК]"],
  name: "rank",
  description: "Ранговая система",
  example: "",
  group: "Misc",
  settings: true
};
