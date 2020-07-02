module.exports.run = async (message,args) => {
  if (!message.member.hasPermission(["BAN_MEMBERS"],{ checkAdmin: true, checkOwner: true })&&!message.owner) {
    return message.reply("Ты не можешь его разбанить")
  }
  if (!message.guild.me.hasPermission("BAN_MEMBERS") || !message.guild.me.hasPermission("ADMINISTRATOR")) {
    return message.reply("Я не могу разбанить, неть прав")
  }
  if (args[0] == undefined || args[0] == '') {
    return message.reply("Собсна а каво мне разбано-заныть?")
  }
  message.guild.unban(args[0]).then(r=>message.channel.send(`Разбанили таки чолодые моловеки <@${args[0]}>`)).catch(e=>message.channel.send("```js\n"+e+"```"))
};
module.exports.help = {
  regexp: ["[uUyYуУ][nNhHнН][bBвВбБ][aAаА][nNhHнН]", "[pPрР][aAаА][зЗ3][bBвВбБ][aAаА][nNhHнН]"],
  name: "unban",
  description: "Разбан по ID (доступно тем кто может банить)",
  example: "<ID того кого разбанить>",
  group: "Admin"
}