const splitter = "\n",
  low = require("lowdb"),
  FileSync = require("lowdb/adapters/FileSync"),
  adapter = new FileSync("cmds/notes.json"),
  db = low(adapter);
db.defaults({}).write();
var helpText = "list покажет все твои заметки\nadd создаст заметку\nremove удалит\nread напишет содержимое заметки\nread- напишет в личку содержимое заметки\nwrite запишет в заметку\nusing пишет как использовать упомянутые ранее команды",
  helpTextUse = `add <название>\nremove <что удалить>\nread <что прочитать>\nread- <что прочитать>\nwrite <название заметки> ${splitter}<что записать>`;
function help(message) {
  return new Core.Discord.RichEmbed()
    .setColor("2ecc71")
    .setTitle("Заметки")
    .setThumbnail(message.author.avatarURL)
    .setFooter(`${Core.client.user.username} ` + version + " - notes")
    .addField("Cписок", helpText);
}

function helpUse(message) {
  return new Core.Discord.RichEmbed()
    .setColor("2ecc71")
    .setTitle("Использование команд")
    .setThumbnail(message.author.avatarURL)
    .setFooter(`${Core.client.user.username} ` + version + " - notes")
    .addField("Cписок", helpTextUse);
}

module.exports.run = async (message, args) => {
  const Discord=Core.Discord,
    client=Core.client
  let command = args.shift();
  if (command == "help")
    return message.channel.send(help(message))
  else if (command == "using")
    return message.channel.send(helpUse(message));
  else if (command == "add") {
    if (!db.has(message.author.id+"." + args.join(' ')).value()) {
      db.set(message.author.id+"." + args.join(' ').replace(/[\n]/g,""),"Тут пока-что ничего нету").write();
      message.channel.send("Создано");
    } else message.reply("УЖЕ СУЩЕСТВУЕТ");
  } else if (command == "remove") {
    if (db.has(message.author.id+"." + args.join(' ')).value()) {
      db.unset(message.author.id+"." + args.join(' ')).write();
      message.channel.send("Удалено");
    } else message.channel.send("Такой заметки не существует");
  } else if (command == "read"||command == "read-") {
    if(command == "read-")message.channel=message.author
    if (db.has(message.author.id+"." + args.join(" ")).value()) message.channel.send(db.get(message.author.id+"." + args.join(' ')).value());
    else message.reply("Такой заметки не существует");
  } else if (command == "write") {
    let c = args.join(' ').split(splitter),
      n = c.shift()
    c = c.join(splitter);
    if (db.has(message.author.id+"." + n)){
      db.set(message.author.id+"." + n,c).write()
      message.delete()
      message.reply("Заметка перезаписана");
    } else message.channel.send("Такой заметки не существует");
  } else if (command == "list") {
      let z = Object.keys(db.get(message.author.id).value())
        .map((m, ind) => `${ind++ + 1}. ${m}`)
        .join("\n");
      if (z == "") z = false;
      if (z) {
        z = z.replace(/\_/g, "\\_").replace(/\*/g, "\\*");
        const embed = new Discord.RichEmbed()
          .setThumbnail(message.author.avatarURL)
          .setTitle("Список заметок")
          .setFooter(`${client.user.username} ${version} - notes`,client.user.avatarURL)
          .setColor("#ccaa12")
          .addField(`Список заметок`, z);
        message.channel.send(embed);
      } else message.channel.send("Заметки не найдены");
    } else return message.reply(`команда не найдена, напиши \`${prefix}notes help\` для получения списка команд`);
}
module.exports.help = {
  name: "notes",
  regexp:["[nN][oOоО0][tTтТ][eEеЕ]","[nN][oOоО0][tTтТ][eEеЕ][sS]","[зЗ3][aAаА][mMмМ][eEеЕ][tTтТ][kKкК][иИ]"],
  description: "Заметки",
  example: "add <название новой заметки>",
  group: "Misc"
};