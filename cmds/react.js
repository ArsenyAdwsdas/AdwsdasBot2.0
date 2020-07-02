module.exports.run = async (message, args) => {
  const Discord=Core.Discord,
    client=Core.client
  message.awaitReactions((reaction, user) => {return user.id==message.author.id;},{ max: 1, time: 60000, errors: ["time"] })
    .then(collected => {
      const reaction = collected.first();
      message.reply("`" + reaction.emoji.name + "`");
    }).catch(collected => message.reply("Timeout"));
};
module.exports.help = {
  name: "react",
  example: "и ставьте какую-то реакцию на это сообщение",
  group: "Misc"
};
