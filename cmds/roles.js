const low = require("lowdb"),
  FileSync = require("lowdb/adapters/FileSync"),
  adapter = new FileSync("cmds/roles.json"),
  DB = low(adapter);
DB.defaults({}).write()
const settings = {
  "unsafe": {
    value: "boolean",
    values: {"boolean":true},
    desc: "Разрешить небезопасное использование (ставить и удалять роли выше своих или свою самую высокую)"
  }
}
var args,
  message,
  helpText = "create создать роль\nremove удалить\nset поменять цвет/имя/права/позицию\nmove передвинуть (`-1` это вниз на 1, `1` это вверх на 1)\nusing показывает как их использовать\nmember поставить/убрать роль\nsettings настройки для сервера(для владельца сервера)",
  helpTextUse = "create <название>\nremove <упоминание роли>\nset <permissions/name/color/position> <упоминание роли> <что выставить>\nmove <упоминание роли> <число>\nmember <set/unset> <юзер> <роль>\nsettings <настройка> <значение>\nsettings help\nsettings list";
function help(message) {
  return new Core.Discord.RichEmbed()
    .setColor("2ecc71")
    .setTitle("Список команд")
    .setThumbnail(message.author.avatarURL)
    .setFooter(`${Core.client.user.username} ` + version + " - roles")
    .addField("Изменение ролей", helpText)
}
function settingsList(message) {
  return new Core.Discord.RichEmbed()
    .setColor("2ecc71")
    .setTitle("Список настроек")
    .setThumbnail(message.author.avatarURL)
    .setFooter(`${Core.client.user.username} ` + version + " - roles")
    .addField("unsafe", "Разрешить небезопасное использование (ставить и удалять роли выше своих или свою самую высокую)\nЗначение: boolean")
}

function helpUse(message) {
  return new Core.Discord.RichEmbed()
    .setColor("2ecc71")
    .setTitle("Использование команд")
    .setThumbnail(message.author.avatarURL)
    .setFooter(`${Core.client.user.username} ` + version + " - roles")
    .addField("Изменение ролей", helpTextUse);
}

module.exports.run = async (message0, args0) => {
  args = args0;
  message = message0;
  rolesLogic(message, args);
};
function rolesLogic(message, args) {
  let server_owner = message.guild.owner.user.id == message.author.id;
  if (!message.guild.me.hasPermission("ADMINISTRATOR", {checkAdmin: true,checkOwner: true})&&message.guild.owner.id!=Core.client.user.id)
    return message.reply("Я не управлять ролями, данный модуль требует право администратора, но его у меня нету");
  if (message.mentions.roles.first()&&!(message.guild.me.highestRole.comparePositionTo(message.mentions.roles.first()) >=0)&&message.guild.owner.id!=Core.client.user.id)
    return message.reply("Данная роль выше меня");
  if (!message.member.hasPermission(["ADMINISTRATOR"], {checkAdmin: true,checkOwner: true}) && !message.owner&&!DB.get(message.guild.id+".fullAccess").find(message.author.id).value())
    return message.reply("Ты не имеешь права `Администратор`");
  if (message.mentions.roles.size != 0 && message.mentions.roles.first().comparePositionTo(message.member.highestRole) >= 0 && !message.owner && !server_owner && !Core.Lib.settings.get("unsafe", DB, message.guild.id))
    return message.reply("Эта роль тебе недоступна");
  let command = args.shift();
  if (command == "help" || command == "helpS") {
    message.channel.send(help(message));
    if (command == "helpS") message.delete();
    return;
  } else if(command == "settings") {
    command = args.shift()
    if(command=="help")
      message.channel.send(Core.Lib.settings.help());
    else if(command=="list")
      message.channel.send(Core.Lib.settings.list(settings));
    else
      message.channel.send(Core.Lib.settings.set(settings, command, message, args, DB))
  } else if (command == "using") {
    return message.channel.send(helpUse(message));
  } else if (command == "create" || command == "createS") {
    let silent = false;
    if (command == "createS") silent = true;
    message.guild.createRole({name: args.join(" ")}).then(created => {
      if (!silent) message.channel.send(`Создана роль <@&${created.id}>`);
      else message.delete();
    }).catch(console.log);
  } else if (command == "remove") {
    if (message.mentions.roles.size != 0) {
      let silent = false;
      if (args[0].endsWith("s")) silent = true;
      message.mentions.roles.first().delete().then(deleted => message.send(`Удалена роль ${deleted.name}`)).catch(console.error);
    } else message.send("А упоминание роли?");
  } else if (command == "move") {
    if (message.mentions.roles.size != 0) {
      let hsdgasdgsad = args.shift();
      let silent = false;
      if (hsdgasdgsad.endsWith("s")) silent = true;
      if (parseInt(args[0]) != NaN) {
        message.mentions.roles.first().setPosition(parseInt(args[0]), true).then(updated => {
          if (!silent) message.send(`Роль <@&${updated.id}> сдвинута на ${parseInt(args[0])}`);
          else message.delete();
        }).catch(console.error);
      } else message.send("Непонятно как передвинуть");
    } else message.send("А упоминание роли?");
  } else if (command == "set") {
    command = args.shift();
    if (!command) return message.send("А что делать?..");
    if (message.mentions.roles.size == 0)
      return message.send("А Упоминание роли?..");
    let mention = args.shift();
    let silent = false;
    if (mention.endsWith("s")) silent = true;
    mention = message.mentions.roles.first();
    if (!args[0]) return message.send("А новое значение не хочешь написать?");
    if (command == "name") {
      const name = mention.name;
      mention.setName(args.join(" ")).then(updated => {
        if (!silent) message.send(`Роль ${name} переименована в ${updated.name}`);
        else message.delete();
      }).catch(console.error);
    } else if (command == "permissions") {
      mention.setPermissions(args).then(updated => {
        if (!silent) message.send(`Права роли изменены`);
        else message.delete();
      }).catch(console.error);
    } else if (command == "color") {
      const color = mention.hexColor;
      mention.setColor(args[0]).then(updated => {
        if (!silent) message.send(`Цвет роли изменен с ${color} на ${updated.hexColor}`);
        else message.delete();
      }).catch(console.error);
    } else if (command == "position") {
      const pos = mention.position;
      message.mentions.roles.first().setPosition(parseInt(args[0])).then(updated => {
          if (!silent)message.send(`Роль <@&${updated.id}> выставлена с позиции ${pos} на позицию ${parseInt(args[0])}`);
          else message.delete();
        }).catch(console.error);
    } else message.reply("Непонятно что делать");
  } else if (command == "member") {
    command = args.shift();
    if (!command) return message.send("А что делать?..");
    let user = args.shift();
    let role = args.shift();
    let silent = args.shift();
    if(silent)silent=true
    if(!role)return message.channel.send("Недостаточно аргументов")
    user = message.guild.members.get(user.replace(/[<>@!#$%&*()]/g,""))
    role = message.guild.roles.get(role.replace(/[<>@!#$%&*()]/g,""))
    if(!user)return message.channel.send("Юзер не найден")
    if(!role)return message.channel.send("Роль не найдена")
    if (command == "set") {
      if (!user.roles.find(r => r.id == role.id)) {
        user.addRole(role).then(added => {
          if (!silent) message.send(`Роль <@&${role.id}> добавлена <@${user.user.id}>`);
          else message.delete();
        }).catch(console.error);
      } else message.reply("У него уже есть эта роль");
    } else if (command == "unset") {
      if (user.roles.find(r => r.id == role.id)) {
        user.removeRole(role).then(added => {
            if (!silent) message.send(`Роль <@&${role.id}> удалена у <@${user.user.id}>`);
            else message.delete();
          }).catch(console.error);
      } else message.reply("У него данной роли не обнаружилось");
    } else message.reply("Непонятно что делать");
  } else return message.reply(`команда не найдена, напиши \`${prefix}roles help\` для получения списка команд`);
}
module.exports.help = {
  regexp: ["[rRpPрРгГ][oOоО0][lLлЛ][nNeEеЕиИьЬ]", "[rRгГ][oOоО0][lL][eEеЕиИ][sS5]"],
  name: "roles",
  description: "Управление ролями (Для админов)",
  example: "create <название роли>",
  group: "Admin",
  settings: true
};
