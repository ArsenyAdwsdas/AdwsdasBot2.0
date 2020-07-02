module.exports.run = async (message, args) => {
  if (message.mentions.users.first()) {
    message.channel.send(
      "\\*" +
        message.mentions.users.first() +
        " был проткнут " +
        message.author +
        " с помощью кол" +
        "*"
    );
  } else {
    message.channel.send("А КОГО УБИТЬ ТО?");
  }
};
module.exports.help = {
  name: "кол",
  description: "Проткнуть кого-то противо-вампирным колом версии `infinity.0`",
  example: "<упоминание>",
  group: "Misc"
};
