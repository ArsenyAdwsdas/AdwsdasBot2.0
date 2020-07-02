module.exports.run = async (message, args) => {
  if(!message.guild.me.hasPermission("BAN_MEMBERS") &&!message.guild.me.hasPermission("ADMINISTRATOR"))
    return message.reply("Я не могу банить, неть прав")
  if(!message.member.hasPermission(["BAN_MEMBERS"], {checkAdmin: true,checkOwner: true}) &&!message.owner)
    return message.reply("Ты не имеешь права банить");
  if(message.mentions.members.size == 0)
    return message.reply("Собсна а каво мне забанано-заныть?");
  if(message.guild.owner.id==message.mentions.users.first().id)
    return message.reply("Это владелец сервера, ты че задумал?");
  if(!(message.member.highestRole.comparePositionTo(message.mentions.members.first().highestRole) >= 1)&&!message.owner)
    return message.reply("Ты не можешь его банить");
  if(message.mentions.users.first().id==Core.ownerID)
    return message.channel.send("Я НЕ СТАНУ БАНИТЬ ЕГО")
  if(message.mentions.members.first().id==message.author.id&&!message.owner)
    return message.reply("Нельзя банить себя");
  console.log(`${message.guild.id}\\${message.guild.name}: ${message.author.id}\\${message.author.name}: ${message.content}`)
  message.mentions.members.first().ban().then(b=>
    message.channel.send(`АЙ БЛ#! Забанили чолодые моловеки <@${message.mentions.members.first().id}>: \`\`${message.mentions.members.first().displayName}\`\` с тегом ${message.mentions.users.first().tag}!`)
  ).catch(e=>message.channel.send("```js\n"+e+"```"))
};

module.exports.help = {
  regexp: ["[bBвВбБ][aAаА][nNhHнН]"],
  name: "ban",
  description: "Бан по упоминанию (доступно тем кто может банить)",
  example: "<упоминание кого банить>",
  group: "Admin"
};
