module.exports.force = async (mode,code) => {
  console.log("FORCED EVAL CHECK")
  if(mode!="eval")return;
  console.log("FORCED EVAL")
  global.forceChannel=Core.client.channels.get("704427701427110138")
  evalMessage({content:`${mode} ${code}`,channel:forceChannel}, code.split(' '));
};
module.exports.onMessageUpdateNoCMD = async (message, args, message0) => {
  if (message.owner && message.content!=message0.content) evalMessage(message, args);
};
module.exports.onMessage = async (message, args) => {
  if (message.owner) evalMessage(message, args);
};
module.exports.onMessageDM = async (message, args) => {
  if (message.owner) evalMessage(message, args);
};
module.exports.onMessageUpdateNoCMD_DM = async (message, args, message0) => {
  if (message.owner && message.content!=message0.content) evalMessage(message, args);
};
module.exports.runtime = () => {
  global.importFresh = require('import-fresh');
}
async function evalMessage(message, args) {
  if (!message.content.startsWith("eval") && !message.content.startsWith(prefix + "eval")) return;
  const msg = message
  const Lib = Core.Lib
  const client = Core.client
  const Discord = Core.Discord
  const _newEmbed = new Core.Discord.RichEmbed()
  const m = Core.Lib.ifElse({member: message.member}, {if: "given.member", do: "given.member"}, {if: "true", do: "undefined"})
  const roles = Core.Lib.ifElse({m: m}, {if: "given.m", do: "given.m.roles"}, {if: "true", do: "undefined"})
  const guild = Core.Lib.ifElse({message: message}, {if: "given.message.guild", do: "given.message.guild"}, {if: "true", do: "undefined"})
  const _m = Core.Lib.ifElse({guild: guild}, {if: "given.guild", do: "given.guild.me"}, {if: "true", do: "undefined"})
  const _roles = Core.Lib.ifElse({_m: _m}, {if: "given._m", do: "given._m.roles"}, {if: "true", do: "undefined"})
  if(message.guild)
    console.log(`${message.guild.id} \\ ${message.guild.name}: ${message.author.id} \\ ${message.author.username}: ${message.content}`);
  else
    console.log(`${message.author.id}\\${message.author.username}: ${message.content}`);
  if(message.content == "eval test")message.content = "eval 'test'"
  let evaled;
  let text;
  const filter = (reaction, user) => {
    return reaction.emoji.name == "❌" && user.id == ownerID;
  };
  try {
    evaled = eval(message.content.slice(message.content.split(/ +/g)[0].length + 1));
    text = Lib.util.inspect(evaled, { compact: true, depth: 0 }).replace(new RegExp(process.env.TOKEN,'g'), "{><=-+BOT TOKEN+-=><}");
    if(text=="Promise { <pending> }")
      evaled.catch(e=> message.channel.send(`\`\`\`js\n${e}\`\`\``))
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
  name: "eval",
  description: "Команда разраба бота, никто кроме него не в состоянии ее использовать... Ее нельзя выключить по настоящему, разраб бота плевал на все ваши выключения модулей",
  hidden: true,
  group: "Serious"
};