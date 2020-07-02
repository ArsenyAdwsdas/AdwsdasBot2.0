module.exports.run = async (message, args) => {
  if (!args[0]) return message.channel.send("Недостаточно аргументов");
  if (!message.owner || (message.owner && !args[1])) args[1] = message.guild.id;
  let user = args[0].replace(/[<@!#$%&*()|>]/g,""),
    guil = Core.client.guilds.get(args[1].replace(/[<@!#$%&*()|>]/g,""));
  if(!guil) return message.channel.send("Сервер не найден")
  user=guil.members.get(user)
  if(!user) return message.channel.send("Юзер не найден")
  let permissions = user.permissions.toArray(),
    c = 0,
    z = "";
  Object.keys(permissions).forEach(function(key) {
    z = z + "\n" + permissions[key];
    c = c + 1;
  });
  message.channel.send(z + "\n" + c + " из 33");
};
module.exports.help = {
  name: "permsMember",
  description: "Список прав юзера на сервере, сильно спамящая команда",
  example: "<ID либо упоминание человека>",
  group: "DONT"
};
