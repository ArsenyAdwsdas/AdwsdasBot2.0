module.exports.run = async (message, args) => {
  const Discord=Core.Discord
  const client=Core.client
  const z = new Discord.RichEmbed()
    .setTitle("Список особых модулей")
    .setFooter(`${client.user.username} ${version} - Help`,client.user.avatarURL)
    .setColor("2ecc71");

  client.SPECIAL_commands.map((m, ind) => `${ind}`)
    .forEach(function(key) {
      let text = client.SPECIAL_commands.get(key).help.description;
      if (client.SPECIAL_commands.get(key).help.example) {
        text = text + "\n" + prefix + key + " " + eval('`'+client.SPECIAL_commands.get(key).help.example+'`');
      }
      z.addField(key, text);
    });
  message.channel.send(z);
};
module.exports.help = {
  name: "listSpecialModules",
  description: "Список особых модулей",
  group: "Info"
};
