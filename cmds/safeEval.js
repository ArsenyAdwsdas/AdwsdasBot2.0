module.exports.run = async (message, args) => {
  console.log(`${message.guild.id}\\${message.guild.name}: ${message.author.id}\\${message.author.name}: ${message.content}`)
  if(!global.LuaExecuted)global.LuaExecuted={}
  if(!global.safeTemp)global.safeTemp={}
  if(!global.safeTemp[message.author.id])global.safeTemp[message.author.id]={}
  let code = args.join(" ").replace(/while/g,"").replace(/for/g,"")
  let text0 = ""
  let filter = (reaction, user) => {
    return reaction.emoji.name == "❌" && user.id == message.author.id;
  };
  try {
    let settings = {
      "LuaExecuted":global.LuaExecuted[message.author.id],
      "temp":global.safeTemp[message.author.id],
      "help":function(){
        return `temp создан специально для временных переменных остающихся на неопределенный срок\n`+
               `LuaExecuted - то что остается после Lua команды\n`+
               `BugReport название говорит за себя... Незнаю зачем но я сделал это\n`+
               `factorial\n`+
               `Тут вообще не работают \`for\` и \`while\`... От слова СОВСЕМ`
      },
      "BugReport":function(text){Core.client.channels.get("708770458975207574").send(`<@${message.author.id}>: ${message.author.tag}: ${text}`)},
      "factorial":Core.Lib.factorial,
      "d": global.disabled
    }
    settings["eval"]=function(code){return Core.Lib.safeEval(code.replace(/while/g,"").replace(/for/g,""), settings)}
    text0 = Core.Lib.safeEval(code,settings)
    let text = text0
    if(typeof text != typeof "gadgs")
      text = Core.Lib.util.inspect(text)
    if(text0=="")
      text0="null"
    if(text=="")
      text="null"
    text = Core.Lib.chunkStringLines(text.replace(/<@.+>/g,"{><=-+ Упоминание +-=><}"), 1990 - "\n".length);
    if(text[3])
      return message.channel.send("Слишком много символов для отправки")
    Object.keys(text).forEach(k => {
      message.channel.send("```js\n" + text[k] + "```").then(msg00 => {
        msg00.react("❌");
        msg00.awaitReactions(filter, { max: 1, time: 120000, errors: ["time"] })
          .then(collected => {
            msg00.delete();
          }).catch();
      }).catch();
    });
  } catch (e) {
    message.channel.send("```js\nОшибка: " + e + "```").then(msg00 => {
      msg00.react("❌");
      msg00.awaitReactions(filter, { max: 1, time: 120000, errors: ["time"] })
        .then(collected => {
          msg00.delete();
        }).catch();
    }).catch();
  }
  return text0
}
module.exports.help = {
  regexp: ["[sS][aAаА][fF][eEеЕ][eEеЕ][vV][aAаА][lL]", "[sScCсС][eEеЕ]", "[cCсС][eEеЕ][йЙ][фФ][eEеЕ][bBвВ][aAаА][лЛ]"],
  name: "safeEval",
  description: "safeEval, идеально в комбинации с Lua командой, для справки можно написать help()",
  group: "Misc"
};