const helpText = "${prefix}${module.exports.help.name} <Группа> [опциональный аргумент S, если имеется то будет список особых модулей в этой группе]"
module.exports.run = async (message, args) => {
  const z = new Core.Discord.RichEmbed()
    .setTitle("Список модулей по группам (вам повезло что я сделал это а то help слишком огромный)")
    .setFooter(`${Core.client.user.username} ${version} - Groups`, Core.client.user.avatarURL)
    .setColor("2ecc71");
  let command = args.shift()
  if(!command||command=="")
    command = "help"
  if(command=="help"){
    z.setDescription(eval(`\`${helpText}\``))
    Object.keys(Core.client.groups.modules).forEach(function(key) {
      z.addField(`${key} (Группа обычных модулей)`, Core.client.groups.modules[key].description);
    })
    Object.keys(Core.client.groups.modulesS).forEach(function(key) {
      z.addField(`${key} (Группа особых модулей)`, Core.client.groups.modulesS[key].description);
    })
  }else{
    let modules = Core.client.groups.modules
    if(args[0]=="S")modules = Core.client.groups.modulesS
    if(modules[command])
      modules[command].grouped.map((m, ind) => `${ind}`).forEach(function(key) {
        let name = key;
        let text = modules[command].grouped.get(key).help.description;
        if (modules[command].grouped.get(key).help.DynamicName) name = eval(`\`${modules[command].grouped.get(key).help.DynamicName}\``);
        if(text==""||!text)text="`Описания у даннного модуля не обнаружено`"
        z.addField(name, text);
      });
    else
      return message.channel.send(`Группа не найдена, пропиши лучше \`${prefix}${module.exports.help.name}\` help а не гадай`)
  }
  message.channel.send(z);
};
module.exports.help = {
  regexp: [
    "[gG6][rRгГ][oOоО0][uU][pPрР][sS5]",
    "[gG6][rRгГ][oOоО0][uU][pPрР][sS5][sS5][hHнН][oOоО0][wW]"
  ],
  name: "groupsShow",
  description: "Список модулей по группам",
  example: "help",
  group: "Info"
};
