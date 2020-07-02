module.exports.run = async (message, args) => {
  const z = new Core.Discord.RichEmbed()
    .setTitle("Список обычных модулей")
    .setFooter(`${Core.client.user.username} ${version} - Help`,client.user.avatarURL)
    .setColor("2ecc71");

  Core.client.commands.map((m, ind) => `${ind}`)
    .forEach(function(key) {
      let name = key;
      let text = Core.client.commands.get(key).help.description;
      z.addField(name, text);
    });
  message.channel.send(z);
};
module.exports.help = {
  name: "listModules",
  description: "Список обычных модулей",
  group: "Info"
};
