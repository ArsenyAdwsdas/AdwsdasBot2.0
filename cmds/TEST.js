const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("cmds/TEST.json");
const db = low(adapter);
db.defaults({bonus:{}, load: {}, msg: {}}).write();
module.exports.onMessageRAW = async (message, args) => {
  Object.keys(db.get(`msg`).value()).forEach(k=>{
    eval(db.get(`msg.${k}`).value())
  })
};
module.exports.run = async (message, args) => {
  if (!message.owner)
    return message.channel.send("БРЫСЬ ПОКА НЕ УЛЕТЕЛ В ЧЕРНЫЙ СПИСОК БОТА")
  let command = args.shift()
  if(db.get(`bonus.${command}`).value())
      eval(db.get(`bonus.${command}`).value())
  try{
    if(command=="EVAL"){
      evalMessage(message, args);
    } else if(command == "RELOAD"){
      const z = `eval global.temp.a = 1; Core.client.commands.set('${module.exports.help.name}', importFresh('./${module.exports.help.name}.js')); global.temp.a = 2; "RELOADED"`
      const z0 = z.split(" ")
      z0.shift()
      Core.client.commands.get("eval").runDM({
        content: z,
        owner: true,
        channel: message.channel,
        member: message.member,
        author: message.author,
        guild: message.guild
      }, z0)
    } else if(!db.get(`bonus.${command}`).value())
      message.channel.send("Такого нету туть")
  }catch(e){message.channel.send(`\`\`\`js\nTEST MODULE ERROR: ${e}\`\`\``)}
};
module.exports.runtime = ()=>{
  Object.keys(db.get("load").value()).forEach(k=>{
    eval(db.get(`load.${k}`).value())
  })
}
async function evalMessage(message, args) {
  const msg = message
  const Lib = Core.Lib
  const client = Core.client
  const Discord = Core.Discord
  const _newEmbed = new Core.Discord.RichEmbed()
  const m = message.member
  const roles = message.member.roles
  const _m = message.guild.me
  const _roles = message.guild.me.roles
  let evaled;
  let text;
  const filter = (reaction, user) => {
    return reaction.emoji.name == "❌" && user.id == Core.ownerID;
  };
  try {
    evaled = eval(message.content.slice(message.content.split(/ +/g)[0].length + message.content.split(/ +/g)[1].length + 2));
    text = Lib.util.inspect(evaled, { compact: true, depth: 0 });
    text = Lib.chunkStringLines(text, 1991 - "\n".length)
    Object.keys(text).forEach(k => {
      if(text[k].length>=1991 - "\n".length)text[k]="{><=-+TOO MANY SYMBOLS+-=><}"
      message.channel.send("```js\n" + text[k] + "```").then(msg00 => {
        msg00.react("❌");
        msg00.awaitReactions(filter, { max: 1, time: 120000, errors: ["time"] })
          .then(collected => {
            msg00.delete();
          }).catch();
      }).catch();
    });
  } catch (e) {
    msg.channel.send("```js\n" + e + "```").then(msg00 => {
      msg00.react("❌");
      msg00.awaitReactions(filter, { max: 1, time: 120000, errors: ["time"] })
        .then(collected => {
          msg00.delete();
        }).catch();
    }).catch();
  }
}
module.exports.help = {
  regexp: ["[tTтТ][eEеЕ][sS5][tTтТ]"],
  name: "TEST",
  description: "...",
  hidden: true,
  group: "Serious"
};