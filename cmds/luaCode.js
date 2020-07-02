global.luainjs = require("lua-in-js")
const { format, parse } = require('lua-json')
global.formatLua=format
global.parseLua=parse
var args;
var message;
var msg;
module.exports.run = async (message0, args0) => {
  args = args0;
  message = message0;
  msg = message;
  if(!global.LuaExecuted)global.LuaExecuted={}
  global.LuaExecuted[message.author.id] = Lua(message.content.slice(prefix.length+4));
};
module.exports.runtime = ()=>{
global.Lua = function(code) {
  console.log(`${message.guild.id}\\${message.guild.name}: ${message.author.id}\\${message.author.username}: ${message.content}`)
  if(LuaExecuted[message.author.id]&&typeof LuaExecuted[message.author.id] != typeof ""&&LuaExecuted[message.author.id].toObject)code = "LuaExecuted="+format(LuaExecuted[message.author.id].toObject()).slice("return ".length)+"\n"+code
  let text0 = ""
  if(!message.owner)code = code.replace(/while/g,"").replace(/for/g,"")
  let filter = (reaction, user) => {
    return reaction.emoji.name == "❌" && user.id == message.author.id;
  };
  try {
    let luaEnv = luainjs.createEnv()
    let luaScript = luaEnv.parse(code)
    text0 = luaScript.exec()
    if(text0===undefined)text0="nil"
    let text = text0
    if(typeof text !== typeof "gadgs")text = Core.Lib.util.inspect(text)
    if(text0==="")text0="nil"
    if(text==="")text="nil"
    text = Core.Lib.chunkStringLines(text, 1990 - "\n".length);
    if(text[3])message.channel.send("Слишком много символов для отправки")
    if(!text[3])Object.keys(text).forEach(k => {
      message.channel.send("```lua\n" + text[k] + "```").then(msg00 => {
        msg00.react("❌");
        msg00.awaitReactions(filter, { max: 1, time: 120000, errors: ["time"] }).then(collected => msg00.delete()).catch();
      }).catch();
    });
  } catch (e) {
    msg.channel.send("```js\n" + e + "```").then(msg00 => {
      msg00.react("❌");
      msg00.awaitReactions(filter, { max: 1, time: 120000, errors: ["time"] }).then(collected => msg00.delete()).catch();
    }).catch();
  }
  return text0
}}
module.exports.help = {
  regexp: "[lLлЛ][uUyYюЮуУ][aAаА]",
  name: "Lua",
  description: "Выполнить Lua код, то что останется после return будет записано в личную переменную LuaExecuted доступную в этом же модуле либо в модуле safeEval"
};
