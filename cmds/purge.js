module.exports.run = async (message, args) => {
  if (!message.member.hasPermission(["ADMINISTRATOR"], {checkAdmin: true,checkOwner: true}) &&!message.owner)
    return message.reply("Ты не имеешь права `Администратор`");
  let limit = parseInt(args[0]);
  if (!limit||limit == NaN)
    return message.channel.send("Это не число");
  limit = limit + 1;
  message.channel.fetchMessages({limit:limit}).then(messages => {
    if (message.mentions.users.first()) {
      let filterBy = args[1].replace(/[<>@!#$%^&*]/g, "");
      messages = messages.filter(m => m.author.id == filterBy).array();
    }
    let deleted
    if(messages.length)deleted=messages.length;
    else if(messages.size)deleted=messages.size
    message.channel.send("Удалено " + deleted + " сообщений");
    message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
  });
}
module.exports.help = {
  regexp: ["[oOоО0][чЧ][иИ][cCсС][tTтТ][иИ][tTтТ][ьЬ]","[pPрР][uU][rR][gG][eEеЕ]","[сcCС][lL][eEеЕ][aAаА][RrгГ]"],
  name: "purge",
  description: "Удаление сообщений в чате, включая эту команду ты ставишь подпись своей кровью что ты осознаешь насколько эта команда ужасна и опасна и что тебе на это плевать и ты хочешь чтоб она была включена",
  example: "<сколько удалить> [упоминание чьи сообщения удалять, если нету то всех]",
  group: "DONT"
};