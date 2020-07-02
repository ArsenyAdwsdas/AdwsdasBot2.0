module.exports.run = async (message, args) => {
  if(!message.owner)return message.channel.send("Ты не создатель бота")
  if(!args[0])return message.channel.send("Сервер не найден")
  let user = Core.client.user;
  let guil = Core.client.guilds.find(r => r.id == args[0]);
  let permissions = guil.member(user).permissions.toArray();
  let c = 0;
  let z = "";
  Object.keys(permissions).forEach(function(key) {
    z = z + "\n" + permissions[key];
    c = c + 1;
  });
  message.channel.send(z + "\n" + c + " из 33");
};
module.exports.help = {
  name: "perms",
  hidden: true,
  description: "Список прав на сервере (команда создателя бота, сильно спамящая)"
};
