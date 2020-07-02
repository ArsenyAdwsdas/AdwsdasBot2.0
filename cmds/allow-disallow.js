module.exports.run = async (message, args) => {
  if(!message.owner)return message.channel.send("```diff\n- ТЫ НЕ МОЙ СОЗДАТЕЛЬ, БРЫСЬ ОТ ЭТОГО МОДУЛЯ```")
  let command = args.shift()
  let modul = args.shift()
  let id = args.shift()
  if(!id)return message.channel.send("```yaml\nНедостаточно аргументов...```")
  if(command == "allow"){
    global.db4.set(modul + "." + id, "1").write()
  }else if(command == "disallow"){
    global.db4.unset(modul + "." + id).write()
  }else return message.channel.send("```yaml\nНепонятно...```")
};
module.exports.help = {
  name: "ACCESS",
  hidden: true,
  description: "Запреты-разрешения создателя бота"
};
