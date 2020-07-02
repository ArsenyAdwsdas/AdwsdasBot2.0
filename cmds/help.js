const low = require("lowdb"),
  FileSync = require("lowdb/adapters/FileSync"),
  adapter = new FileSync("cmds/help.json"),
  DB = low(adapter);
DB.defaults({}).write()
const settings = {
  "dm": {
    value: "boolean",
    values: {"boolean":true},
    desc: "Если true то будет писать в личку"
  },
  "hideDisabled": {
    value: "boolean",
    values: {"boolean":true},
    desc: "Если true то отключеные модули не будут показываться"
  }
}
module.exports.run = async (message, args) => {
  let command = args.shift()
  if(command == "settings") {
    command = args.shift()
    if(command=="help")
      message.channel.send(Core.Lib.settings.help());
    else if(command=="list")
      message.channel.send(Core.Lib.settings.list(settings));
    else
      message.channel.send(Core.Lib.settings.set(settings, command, message, args, DB))
  } else {
    const toSend = (!Core.Lib.settings.get("dm", DB, message.guild.id) && message.channel) || message.author
    const z = new Core.Discord.RichEmbed()
      .setFooter(`${Core.client.user.username} ${version} - Help`, Core.client.user.avatarURL)
      .setColor("2ecc71");
    let errored = false
    if(!command){
      z.setTitle("Список команд")
      Core.client.commands.map((m, ind) => `${ind}`).forEach(function(key) {
        if (!Core.client.commands.get(key).help.hidden && Core.client.commands.get(key).run && (!Core.Lib.settings.get("hideDisabled", DB, message.guild.id) || !disabled[key])) {
          let name = key;
          let text = Core.client.commands.get(key).help.description;
          if (Core.client.commands.get(key).help.DynamicName) name = eval('`'+Core.client.commands.get(key).help.DynamicName+'`');
          text = `${text}\nПоддержка настроек: ${Core.Lib.rusish(Core.client.commands.get(key).help.settings||false)}`
          if (Core.client.commands.get(key).help.example) text = text + "\n" + prefix + name + " " + eval('`'+Core.client.commands.get(key).help.example+'`');
          if(text==""||!text)text="`Описания у даннного модуля не обнаружено`"
          try{
            z.addField(prefix + name, text)
          }catch(e){
            errored = true
            Core.client.users.get(Core.ownerID).send(`\`\`\`js\nHELP ERROR: ${e}\`\`\``)
          }
        }
      });
      try{
        z.addField("ПРЕФИКСЫ","У этого бота есть куча префиксов но вот главные, `"+prefix+"` `"+prefix2+"` поддерживаются русские А и маленькие тоже")
      }catch(e){
        errored = true
        Core.client.users.get(Core.ownerID).send(`\`\`\`js\nHELP ERROR: ${e}\`\`\``)
      }
    } else {
      args[0] = command
      if(!Core.client.commands.get(args[0]))
        return toSend.send(`Модуль с названием \`${args[0]}\` не обнаружен`);
      z.setTitle(args[0])
      z.addField("Описание", Core.client.commands.get(args[0]).help.description || "`Описания у даннного модуля не обнаружено`")
      if(Core.client.commands.get(args[0]).help.example)
        z.addField("Пример", `${prefix}${args[0]} ${eval('`'+Core.client.commands.get(args[0]).help.example+'`')}`)
      z.setDescription(`Поддержка настроек: ${Core.Lib.rusish(Core.client.commands.get(args[0]).help.settings||false)}`)
    }
    if(!errored)
      toSend.send(z);
    else
      message.channel.send(`Ошибка при создании Embed, используй \`${prefix}listCommands\` и \`${prefix}help <Название модуля>\` до тех пор пока <@${Core.ownerID}> не починит этот модуль`);
  }
};
module.exports.help = {
  regexp: ["[xXхХ][eEеЕ][Лл][nNпП]", "[xXхХ][eEеЕ][Лл][nNпП][aAаА][hHnNнН][иИnN]", "[xXхХ][eEеЕ][Лл][nNпП][aAаА][nNйЙиИ]", "[xXхХ][eEеЕ][nNлЛ][nNпП][Ьь]", "[hHнН][eEеЕ][Ll][pPрР]", "[nNпП][oOоО0][mMмМ][oOоО0][Щщ][ьЬ]", "[nNпП][oOоО0][mMмМ][oOоО0][rRгГ][aAаА][йЙ]"],
  name: "help",
  description: "Список команд",
  group: "Info",
  example: "help",
  settings: true
};
