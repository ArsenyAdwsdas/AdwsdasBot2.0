const replacer = {
  "0":"**0**",
  "1":"**1**",
  "2":"**2**",
  "3":"**3**",
  "4":"**4**",
  "5":"**5**",
  "6":"**6**",
  "7":"**7**",
  "8":"**8**",
  "9":"**9**",
  "a":"__a__",
  "A":"__A__",
  "b":"__b__",
  "B":"__B__",
  "c":"__c__",
  "C":"__C__",
  "d":"__d__",
  "D":"__D__",
  "e":"__e__",
  "E":"__E__",
  "f":"__f__",
  "F":"__F__",
  "h":"__h__",
  "H":"__H__",
  "i":"__i__",
  "I":"__I__",
  "j":"__j__",
  "J":"__J__",
  "k":"__k__",
  "K":"__K__",
  "l":"__l__",
  "L":"__L__",
  "m":"__m__",
  "M":"__M__",
  "n":"__n__",
  "N":"__N__",
  "o":"__o__",
  "O":"__O__",
  "p":"__p__",
  "P":"__P__",
  "q":"__q__",
  "Q":"__Q__",
  "r":"__r__",
  "R":"__R__",
  "s":"__s__",
  "S":"__S__",
  "t":"__t__",
  "T":"__T__",
  "u":"__u__",
  "U":"__U__",
  "v":"__v__",
  "V":"__V__",
  "w":"__w__",
  "W":"__W__",
  "x":"__x__",
  "X":"__X__",
  "y":"__y__",
  "Y":"__Y__",
  "z":"__z__",
  "Z":"__Z__",
  "\\*\\*\\*\\*":"",
  "____":""
}
module.exports.run = async (message, args) => {
  const Discord=Core.Discord
  const client=Core.client
  let z = new Discord.RichEmbed()
    .setTitle("Список RegExp использований команд")
    .setFooter(`${client.user.username} ${version} - RegExp`,client.user.avatarURL)
    .setColor("2ecc71");

  client.commands.map((m, ind) => `${ind}`).forEach(function(key) {
    if (!client.commands.get(key).help.hidden&&client.commands.get(key).help.regexp) {
      let name = key;
      let text;
      if(typeof client.commands.get(key).help.regexp==typeof [1,41,4114])text = client.commands.get(key).help.regexp.join(", ");
        else text = client.commands.get(key).help.regexp
      if(!text)text=client.commands.get(key).help.name
      z.addField(name, replaceObject(text,replacer));
    }
  });
  message.channel.send(z);
};
module.exports.help = {
  regexp: [
    "[pPрР][eEеЕ][rRгГ][eEеЕ][kKкК][cCсС]",
    "[pPрР][eEеЕ][rRгГ][eEеЕ][kKкК][cCсС][пПnN]",
    "[rRгГ][eEеЕ][gGxXхХ6][eEеЕ][xXхХ][pPрР]",
    "[cCсС][бБ6][oOоО0][pPрР][hHnNнН][nNиИ][kKкК]\\-[зЗ3][aAаА][kKкК][nNлЛ][nNиИ][hHnNнН][aAаА][hHnNнН][nNиИ][nNиИйЙ]",
    "[kKкК][hHnNнН][nNиИ][rRгГ][aAаА]\\-[зЗ3][aAаА][kKкК][nNлЛ][nNиИ][hHnNнН][aAаА][hHnNнН][nNиИ][nNиИйЙ]",
    "[cCсС][бБ6][oOоО0][pPрР][hHnNнН][nNиИ][kKкК]\\-[зЗ3][aAаА][kKкК][nNлЛ][rRяЯ][tTтТ][nNиИ][nNиИйЙ]",
    "[kKкК][hHnNнН][nNиИ][rRгГ][aAаА]\\-[зЗ3][aAаА][kKкК][nNлЛ][rRяЯ][tTтТ][nNиИ][nNиИйЙ]"
  ],
  name: "RegExp",
  description: "Список RegExp у команд, английские буквы подчеркиваются, цифры становятся жирными",
  group: "Misc"
};
