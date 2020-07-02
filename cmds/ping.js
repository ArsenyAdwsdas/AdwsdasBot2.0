module.exports.run = async (message, args) => {
  const send = (message.cleanContent.slice(message.content.split(" ")[0].length).replace(/ /g, "") != "" && message.cleanContent.slice(message.content.split(" ")[0].length).replace(/@@everyone/g, "@еveryone")) || "Я туть"
  message.channel.send(send);
};
module.exports.help = {
  regexp: ["", "[pPрР][iI][nN][gG]", "[пП][иИ][нНhH][гГr]", "[Жж][иИ][bBвВ][oOоО0][йЙ][?7]", "[sS5][aAаА][yYуУ]", "[cCсС][kKкК][aAаА][xXхХжЖ][nNиИ]"],
  name: "ping",
  description: "Команда для проверки жив ли бот... А то иногда его разраб ломает его... Так же может работать как `say` у некоторых ботов",
  group: "NIL"
};
