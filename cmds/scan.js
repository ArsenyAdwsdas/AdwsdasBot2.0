module.exports.run = async (message, args) => {
  let member = message.mentions.members.first();
  if (!member) return message.channel.send("А КОГО КСТАТИ СКАНИРОВАТЬ?");
  let member_info_embed = new Core.Discord.RichEmbed()
    .setTitle('Информация о пользователе')
    .setColor("2ecc71")
    .addField('Инфа 100%: ',`Имя: ${member.user.username}\nТег: ${member.user.tag}\nID: ${member.user.id}\nБот: ${Core.Lib.rusish(member.user.bot)}\nЗарегистрирован: ${member.user.createdAt.toDateString()}\nПрисоединился: ${message.mentions.members.first().joinedAt.toDateString()}`);
  message.channel.send(member_info_embed);
};
module.exports.help = {
  regexp: ["[sScCсС][kKcCсСкК][aAаА][hHnNнН]"],
  name: "scan",
  description: "Показывает инфу про того кто упомянут",
  example: "<упоминание>",
  group: "Info"
};
