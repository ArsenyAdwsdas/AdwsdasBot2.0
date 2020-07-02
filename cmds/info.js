module.exports.run = async (message, args) => {
  const Discord=Core.Discord
  const client=Core.client
  if(args[0]!=Core.botUsername)return;
  const embed = new Discord.RichEmbed()
    .setTitle("О боте")
    .setFooter(`${client.user.username} ${version} - Help`,client.user.avatarURL)
    .setColor("2ecc71")
    .addField("Инфа +-100%","```yaml\n Я изначально был написан на JavaScript в Notepad++ но сейчас Арсений пишет меня в встроенном редакторе Glitch```")
    .addField("Сервера","В данный момент бот находится на "+client.guilds.size+" серверах.")
    .addField("Эмодзи","В данный момент бот знает "+client.emojis.size+" эмодзей.")
    .addField("Юзеры","В данный момент бот знает "+client.users.size+" юзеров.")
    .addField("Каналы","В данный момент бот знает "+client.channels.size+" каналов (по логике Discord категории тоже считаются каналами а создателю бота лень с этим разбиратся)")
    .addField("Время без перезапусков бота", Core.Lib.timeFormat(Date.now()-client.readyAt))
  message.channel.send(embed);
};
module.exports.help = {
  regexp: "[oOоО]",
  DynamicName: "o ${Core.botUsername}",
  name: "о",
  description: "Инфа  про бота"
};
