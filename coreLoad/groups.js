class groups{
  constructor() {
    const Groups = {
      "Serious": "Никаких шуток, чистая серьезность, осквернение этой категории не прощается даже после смерти",
      "Admin": "Административные ||~~с шутками конечно же~~|| модули",
      "DONT": "Не советую держать такие модули включенными",
      "Info": "Информационные модули",
      "Misc": "В основном шлак всякий, фиг знает ваще что там за идиотизм творится",
      "Stupid": "Идиостические модули... будто бы тупости и идиотизма создателя бота не хватало...",
      "NIL": "Все что не находится в какой-либо другой группе"
    }
    const GroupsSpecial = {
      "СварщикOnly": "Особые модули доступные только товарищу сварщику бота, если попробуете их использовать то бот может вас послать куда подальше",
      "NIL": "Все что не находится в какой-либо другой группе"
    }
    const client = Core.client
    const Discord = Core.Discord

    client.groups={};
    client.groups.modules={};
    client.groups.modulesS={};
    Object.keys(Groups).forEach(k=>
      client.groups.modules[k] = {description: Groups[k], grouped: new Discord.Collection()}
    );
    Object.keys(GroupsSpecial).forEach(k=>
      client.groups.modulesS[k] = {description: GroupsSpecial[k], grouped: new Discord.Collection()}
    );
    client.commands.forEach((v,k)=>{
      if(!v.help.group)
        client.groups.modules.NIL.grouped.set(k, v)
      else if(client.groups.modules[v.help.group])
        client.groups.modules[v.help.group].grouped.set(k, v);
    });
    client.SPECIAL_commands.forEach((v,k)=>{
      if(!v.help.group)
        client.groups.modulesS.NIL.grouped.set(k, v)
      else if(client.groups.modulesS[v.help.group])
        client.groups.modulesS[v.help.group].grouped.set(k, v);
    });
  }
};setTimeout(()=>{new groups()},10)