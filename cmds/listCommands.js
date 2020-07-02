const low = require("lowdb"),
  FileSync = require("lowdb/adapters/FileSync"),
  adapter = new FileSync("cmds/listCommands.json"),
  DB = low(adapter);
DB.defaults({}).write()
const settings = {
  "dm": {
    value: "boolean",
    values: {"boolean":true},
    desc: "Если true то будет писать в личку"
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
    let errored = false
    const z = new Core.Discord.RichEmbed()
      .setFooter(`${Core.client.user.username} ${version} - Help`, Core.client.user.avatarURL)
      .setColor("2ecc71")
      .setTitle("Список команд")
    z.setDescription(`Дай угадаю help сломался на#уй?`)
    let text = ""
    Core.client.commands.map((m, ind) => `${ind}`).forEach(function(key) {
      if (!Core.client.commands.get(key).help.hidden && Core.client.commands.get(key).run) {
        const name = (Core.client.commands.get(key).help.DynamicName && eval('`'+Core.client.commands.get(key).help.DynamicName+'`')) || Core.client.commands.get(key).help.name
        if(!(`${text}, ${name}`.length >= 1999))
          text = `${text}\n${name}`
        else {
          z.addField(`${z.fields.length+1} часть`, text)
          text = name
        }
      }
    });
    z.addField(`${z.fields.length+1} часть`, text)
    toSend.send(z);
  }
};
module.exports.help = {
  name: "listCommands",
  description: "Список команд",
  group: "Info",
  example: "help",
  settings: true
};
