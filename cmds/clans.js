const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("cmds/clans.json");
const db = low(adapter);
db.defaults({}).write();
const helpText =
  "join присоедится в клан\nleave покинуть клан\ncreate создать клан\nkick кикнуть человека из клана по ID либо упоминанию\nusing покажет как используются команды\nlist это список кланов на сервере\nlistMembs это список участников твоего клана\ninfo информация про клан\nvoteAddOwner голосование за нового владельца\nvoteRemoveOwner голосование за удаление владельца\nvoteSetOwner голосование за то ставить ли единственным владельцем\nvoteKick голосование за кик\nsetPassword установить новый пароль\nviewPassword пишет пароль в личку";
const helpTextUse =
  "join <название клана> [переход на следующую строку если надо ввести пароль] [пароль, если отсутствует пароль клана то введенный пароль игнорируется]\ncreate <название клана>\nkick <либо ID либо упоминание юзера>\nvoteAddOwner <ID либо упоминание юзера>\nvoteRemoveOwner <ID либо упоминание юзера>\nvoteSetOwner <ID либо упоминание юзера>\nvoteKick <ID либо упоминание юзера>\nsetPassword <новый пароль либо false для удаления>";
function help(message) {
  return new Core.Discord.RichEmbed()
    .setColor("2ecc71")
    .setTitle("Кланы")
    .setThumbnail(message.author.avatarURL)
    .setFooter(Core.client.user.username + " " + version + " - Кланы")
    .addField("Cписок", helpText);
}

function helpUse(message) {
  return new Core.Discord.RichEmbed()
    .setColor("2ecc71")
    .setTitle("Использование команд")
    .setThumbnail(message.author.avatarURL)
    .setFooter(Core.client.user.username + " " + version + " - Кланы")
    .addField("Cписок", helpTextUse)
}
class Clаn {
  constructor(name, guild, member, OWNER, channel){
    const clan = db.get("guildList." + guild.id + "." + name).value();
    this.exists = false;
    if(!clan) return;
    this.creator = guild.members.get(clan.creator);
    this.name = name;
    this.guild = guild;
    this.member = member;
    this.channel = channel;
    this.OWNER = OWNER;
    this.creatorID = clan.creator
    this.ownerID = clan.owner
    this.exists = true
    this.role = guild.roles.find(r=>r.name==`//Клан\\\\: ${this.name}`)
    this.password = clan.password;
    this.members = {}

    Object.keys(clan.members).forEach(v=>{
      if(guild.members.get(v))
        this.members[v] = guild.members.get(v);
      else
        this.removeMember(v)
    });

    if(!this.members[this.member])
      this.removeMember(this.member)

    if(typeof clan.owner == typeof "asd"){
      this.owner = guild.members.get(clan.owner)
      this.owners = {}
      this.owners[this.owner.id] = this.owner
    }
    else {
      this.owners = {}
      clan.owner.forEach(v=>{
        if(guild.members.get(v))
          this.owners[v] = guild.members.get(v);
        else
          this.removeMember(v)
      });
    }

    this.createdAt = clan.createdAt;
    this.createdAtDate = Core.Lib.rusishFormatTimeI(clan.createdAt);
  }
  destroy(force){
    if(this.OWNER || (this.owner && this.owner.id == this.member.id) || (this.owners && this.owners[this.member.id])){
      if(force==false&&Object.keys(this.members).length!=0) return;
      const clanMembs = db.get(`guildList.${this.guild.id}.${name}.members`).value()
      Object.keys(clanMembs).forEach(id=>{
        if(db.get(`userList.${id}.${this.guild.id}`).value()==this.name)
          db.set(`userList.${id}.${this.guild.id}`, "").write()
      })
      db.unset(`guildList.${this.guild.id}.${this.name}`).write()
      if(this.role)
        this.role.delete().catch(e=>this.channel.send(`\`\`\`js\n${e}\`\`\``))
      return "Клан уничтожен"
    } else return "Ты не его создатель"
  }
  removeMember(id){
    if(!id||id=="")
      return "НИКАКОГО МУСОРА В DB"
    db.set(`userList.${id}.${this.guild.id}`, "").write()
    db.unset(`guildList.${this.guild.id}.${this.name}.members.${id}`).write()
    if(this.guild.members.get(id)&&this.guild.members.get(id).roles.get(this.role.id))
      this.guild.members.get(id).removeRole(this.role)
    delete this.members[id]
    return "☑️"
  }
  addMember(id){
    if(db.get(`userList.${id}.${this.guild.id}`).value()!="")
      db.unset(`guildList.${this.guild.id}.${this.name}.members.${id}`).write()
    db.set(`userList.${id}.${this.guild.id}`, this.name).write()
    db.set(`guildList.${this.guild.id}.${this.name}.members.${id}`, 1).write()
    this.members[id] = this.guild.members.get(id)
    this.members[id].addRole(this.guild.roles.find(r=>r.name==`//Клан\\\\: ${this.name}`)).catch(e=>this.channel.send(`\`\`\`js\n${e}\`\`\``))
    return "☑️"
  }
  setOwner(id){
    db.set(`guildList.${this.guild.id}.${this.name}.owner`, id).write()
    return "☑️"
  }
  removeOwner(id){
    delete this.owners[id]
    db.set(`guildList.${this.guild.id}.${this.name}.owner`, Object.keys(this.owners)).write()
    return "☑️"
  }
  addOwner(id){
    let newOwners = []
    if(this.owner)
      newOwners[0] = this.owner.id
    else
      newOwners = Object.keys(this.owners)
    newOwners.unshift(id)
    db.set(`guildList.${this.guild.id}.${this.name}.owner`, newOwners).write()
    return "☑️"
  }
  leave(){
    this.removeMember(this.member.user.id)
    return `Ты покинул клан ${this.name}`
  }
  setPassword(z){
    if(z==""||!z)
      z = false
    db.set(`guildList.${this.guild.id}.${this.name}.password`, z).write()
  }
  checkOwner(){
    return (this.owner && this.owner.id==this.member.id) || (this.owners && this.owners[this.member.id]) || this.OWNER
  }
}
module.exports.run = async (message, args) => {
  const msg = message
  try {
    args = args.join(" ").replace(/[<>@!#$%\^\&*()\.\-\=\+\,]/g, "").split(" ")
    let command = args.shift();
    if (!db.has("userList." + msg.author.id + "." + msg.guild.id).value())
      db.set("userList." + msg.author.id + "." + msg.guild.id, "").write();
    let inClan = db.get("userList." + msg.author.id + "." + msg.guild.id).value();
    let inClanResolved = false;
    const Clan = new Clаn(inClan, msg.guild, msg.member, msg.owner, msg.channel);
    let ClanRole = msg.member.roles.find(r=>r.name.startsWith("//Клан\\\\: "))
    if (inClan != "") {
      inClanResolved = db.get("guildList." + msg.guild.id + "." + inClan).value();
      if (!inClanResolved)
        db.set("userList." + msg.author.id + "." + msg.guild.id, "").write();
    }
    if (command == "listMembs") {
      if (Clan.exists) {
        let z = Object.keys(Clan.members).map((m, ind) => `${msg.guild.members.get(m).name||msg.guild.members.get(m).user.username}: <@${m}> ID: ${m}`).join("\n");
        if (z == "")
          z = false;
        if (z) {
          message.author.send(
            new Core.Discord.RichEmbed()
              .setTitle("Список участников клана")
              .setFooter(`${Core.client.user.username} ${version} - Кланы`, Core.client.user.avatarURL)
              .setColor("2ecc71")
              .addField(`Участники клана`, z)
          );
          message.channel.send("Отправлено в личку");
        } else
          message.channel.send("Люди в клане не найдены... ||ЭТ КАК||");
      } else
        message.channel.send("Ты не в клане");
    } else if (command == "list") {
      let z = Object.keys(db.get("guildList." + msg.guild.id).value()).map((m, ind) => `${ind++ + 1}. ${m}`).join("\n");
      if (z == "")
        z = false;
      if (z) {
        z = z.replace(new RegExp(/[_]/g), "\\_").replace(new RegExp(/[*]/g), "\\*");
        message.channel.send(
          new Core.Discord.RichEmbed()
            .setThumbnail(message.author.avatarURL)
            .setTitle("Список кланов")
            .setFooter(`${Core.client.user.username} ${version} - Кланы`, Core.client.user.avatarURL)
            .setColor("2ecc71")
            .addField(`Список кланов`, z)
        );
      } else
        message.channel.send("Кланы не найдены");
    } else if (command == "help") {
      return msg.channel.send(help(msg));
    } else if (command == "using") {
      return msg.channel.send(helpUse(msg));
    } else if (command == "create") {
      if (!Clan.exists) {
        if (!db.has("guildList." + msg.guild.id + "." + args.join(" ")).value()) {
          args = args.join(" ").replace(/\./g,"")
          let password = args.split("\n")
          const name = password.shift()
          password=password[0]
          if(name == "" || !name)
            return msg.channel.send("А название?");
          if(!password||password=="")
            password=false
          msg.guild.createRole({name: `//Клан\\\\: ${name}`, mentionable:true, hoist:true, color: "BLUE"}).then(r=>{
            msg.member.addRole(r)
            db.set("userList." + msg.author.id + "." + msg.guild.id, name).write();
            const members = {};
            members[msg.author.id] = 1;
            db.set("guildList." +msg.guild.id +"." +name, {creator: message.author.id, password: password, createdAt: Core.Lib.rusishFormatTime(new Date()), owner: message.author.id, members: members}).write();
            msg.channel.send("Создан клан " + name);
          }).catch(e=>message.channel.send(`\`\`\`js\n${e}\`\`\``))
        } else
          msg.channel.send("Уже существует");
      } else
        msg.channel.send(`Ты уже в клане, что-бы покинуть его пропиши ${prefix}clans leave`);
    } else if (command == "leave") {
      if (Clan.exists) {
        msg.channel.send(Clan.leave());
        Clan.OWNER=true
        Clan.destroy(false)
      } else
        msg.channel.send("Ты не в клане");
    } else if (command == "join") {
      if (inClan == "") {
        if (db.has("guildList." + msg.guild.id + "." + args.join(" ").split("\n")[0]).value()) {
          if(!db.get("guildList." + msg.guild.id + "." + args.join(" ").split("\n")[0]+".closed").value()){
            let password = args.join(" ").split("\n");
            let clan = password.shift();
            if (!password)
              password = "";
            let clanPassword = db.get("guildList." +msg.guild.id +"." +args.join(" ").replace(/\n/g, "") +".password").value();
            if (!clanPassword)
              clanPassword = "";
            if (clanPassword == password || clanPassword == "") {
              db.set("guildList." +msg.guild.id +"." +clan +".members." +msg.author.id,1).write();
              db.set("userList." + msg.author.id + "." + msg.guild.id,clan).write();
              msg.channel.send("Ты зашел в клан " + clan);
              msg.member.addRole(msg.guild.roles.find(r=>r.name==`//Клан\\\\: ${clan}`)).catch(e=>message.channel.send(`\`\`\`js\n${e}\`\`\``))
            } else
              msg.channel.send("Неверный пароль");
          } else
            msg.channel.send("Клан закрыт")
        } else
          msg.channel.send("Клан не найден");
      } else
        msg.channel.send("Ты уже в клане, что-бы покинуть его пропиши `" +prefix +"clans leave`");
    } else if(command == "toEval"&&msg.owner){
      global.temp.Clan = Clan
    } else if(command == "forceJoin"&&msg.owner){
      message.channel.send(Clan.addMember(args[0]))
    } else if(command == "voteKick"){
      if(Clan.exists){
        if(Clan.checkOwner()){
          if(!Clan.members[args[0]])
            return message.channel.send("Его нет в клане")
          if(Clan.owners && Clan.owners[args[0]])
            return msg.channel.send("Нельзя, это другой владелец клана")
          const filter = (reaction, user) => {return user.id != Core.client.user.id && ['☑️', '❌'].includes(reaction.emoji.name) && Clan.members[user.id];};
          const max = Object.keys(Clan.members).length;
          function voted(collected, memb){
            if(!collected.get("❌") && !collected.get("☑️"))
              return `Никто не голосовал, <@${memb}> остается в клане ${Clan.name}`
            if(!collected.get("❌") && collected.get("☑️")){
              if(max/2>collected.get("☑️").size)
                return `Проголосавало менее 50% людей в клане, <@${memb}> остается в клане ${Clan.name}`;
              Clan.removeMember(args[0]);
              return `Никто не голосовал против кика, <@${memb}> кикается из клана ${Clan.name}`
            }
            if(!collected.get("☑️") && collected.get("❌")){
              if(max/2>collected.get("❌").size)
                return `Проголосавало менее 50% людей в клане, <@${memb}> остается в клане ${Clan.name}`;
              return `Никто не голосовал за кик, <@${memb}> остается в клане ${Clan.name}`
            }
            const yes = collected.get("☑️").users.size
            const no = collected.get("❌").users.size
            if(max/2>yes+no)
              return `Проголосавало менее 50% людей в клане, <@${memb}> остается в клане ${Clan.name}`;
            if(yes>no){
              Clan.removeMember(args[0]);
              return `Большая часть голосовавших голосовала за кик, <@${memb}> кикается из клана ${Clan.name}`
            } else
              return `Большая часть голосовавших голосовала против кика, <@${memb}> остается в клане ${Clan.name}`
          }
          message.channel.send(new Core.Discord.RichEmbed()
            .setTitle(`Голосование за кик из клана ${Clan.name}`)
            .setFooter(`${Core.client.user.username} ${version} - Clan Vote`, Core.client.guild)
            .setColor("2ecc71")
            .setDescription(`Претендент на кик: <@${args[0]}>\nУсловия кика: учитываются только те кто в этом клане, если проголосовало меньше 50% то кик отменяется, для кика необходимо чтоб более 50% голосовавших голосовало за кик`)
          ).then(message=>{
            message.react("☑️").then(m=>message.react("❌"))
            message.awaitReactions(filter, {max: max, time: 300000, errors: ["time"]})
              .then(collected =>
                message.channel.send(new Core.Discord.RichEmbed()
                  .setTitle(`Результат голосования за кик из клана ${Clan.name}`)
                  .setFooter(`${Core.client.user.username} ${version} - Clan Vote`, Core.client.guild)
                  .setColor("2ecc71")
                  .setDescription(voted(collected, args[0]))
                )
              )
              .catch(collected =>
                message.channel.send(new Core.Discord.RichEmbed()
                  .setTitle(`Результат голосования за кик из клана ${Clan.name}`)
                  .setFooter(`${Core.client.user.username} ${version} - Clan Vote`, Core.client.guild)
                  .setColor("2ecc71")
                  .setDescription(voted(collected, args[0]))
                )
              );
          }).catch(e => msg.channel.send(`\`\`\`js\n${e}\`\`\``))
        } else msg.channel.send("Ты не глава клана")
      } else msg.channel.send("Ты не в клане")
    } else if(command == "voteSetOwner"){
      if(Clan.exists){
        if(Clan.checkOwner()){
          if(!Clan.members[args[0]])
            return message.channel.send("Его нет в клане")
          const filter = (reaction, user) => {Clan.member = user; return user.id != Core.client.user.id && ['☑️', '❌'].includes(reaction.emoji.name) && Clan.checkOwner();};
          const max = Object.keys(Clan.owners).length;
          function voted(collected, memb){
            if(!collected.get("❌") && !collected.get("☑️"))
              return `Никто не голосовал, <@${memb}> не становится единственным владельцем клана ${Clan.name}`
            if(!collected.get("❌") && collected.get("☑️")){
              if(max/2>collected.get("☑️").size)
                return `Проголосавало менее 50% людей в клане, <@${memb}> не становится единственным владельцем клана ${Clan.name}`;
              Clan.setOwner(args[0]);
              return `Никто не голосовал против, <@${memb}> становится единственным владельцем клана ${Clan.name}`
            }
            if(!collected.get("☑️") && collected.get("❌")){
              if(max/2>collected.get("❌").size)
                return `Проголосавало менее 50% людей в клане, <@${memb}> не становится единственным владельцем клана ${Clan.name}`;
              return `Никто не голосовал за, <@${memb}> не становится единственным владельцем клана ${Clan.name}`
            }
            const yes = collected.get("☑️").users.size
            const no = collected.get("❌").users.size
            if(max/2>yes+no)
              return `Проголосавало менее 50% людей в клане, <@${memb}> не становится единственным владельцем клана ${Clan.name}`;
            if(yes>no){
              Clan.setOwner(args[0]);
              return `Большая часть голосовавших голосовала за, <@${memb}> становится единственным владельцем клана ${Clan.name}`
            } else
              return `Большая часть голосовавших голосовала против, <@${memb}> не становится единственным владельцем клана ${Clan.name}`
          }
          message.channel.send(new Core.Discord.RichEmbed()
            .setTitle(`Голосование за становление <${args[0]}> единственным владельцем клана ${Clan.name}`)
            .setFooter(`${Core.client.user.username} ${version} - Clan Vote`, Core.client.guild)
            .setColor("2ecc71")
            .setDescription(`Претендент на становление единственным владельцем клана: <@${args[0]}>\nУсловия голосования: учитываются только те кто в этом клане, если проголосовало меньше 50% то добавление отменяется, для добавления необходимо чтоб более 50% голосовавших голосовало за добавление`)
          ).then(message=>{
            message.react("☑️").then(m=>message.react("❌"))
            message.awaitReactions(filter, {max: max, time: 300000, errors: ["time"]})
              .then(collected =>
                message.channel.send(new Core.Discord.RichEmbed()
                  .setTitle(`Результат голосования за становление <${args[0]}> единственным владельцем клана ${Clan.name}`)
                  .setFooter(`${Core.client.user.username} ${version} - Clan Vote`, Core.client.guild)
                  .setColor("2ecc71")
                  .setDescription(voted(collected, args[0]))
                )
              )
              .catch(collected =>
                message.channel.send(new Core.Discord.RichEmbed()
                  .setTitle(`Результат голосования за становление <${args[0]}> единственным владельцем клана ${Clan.name}`)
                  .setFooter(`${Core.client.user.username} ${version} - Clan Vote`, Core.client.guild)
                  .setColor("2ecc71")
                  .setDescription(voted(collected, args[0]))
                )
              );
          }).catch(e => msg.channel.send(`\`\`\`js\n${e}\`\`\``))
        } else msg.channel.send("Ты не глава клана")
      } else msg.channel.send("Ты не в клане")
    } else if(command == "voteAddOwner"){
      if(Clan.exists){
        if(Clan.checkOwner()){
          if(!Clan.members[args[0]])
            return message.channel.send("Его нет в клане")
          if(Clan.owners && Clan.owners[args[0]])
            return msg.channel.send("Нельзя, он уже владелец клана")
          const filter = (reaction, user) => {Clan.member = user; return user.id != Core.client.user.id && ['☑️', '❌'].includes(reaction.emoji.name) && Clan.checkOwner();};
          const max = Object.keys(Clan.owners).length;
          function voted(collected, memb){
            if(!collected.get("❌") && !collected.get("☑️"))
              return `Никто не голосовал, <@${memb}> не становится владельцем клана ${Clan.name}`
            if(!collected.get("❌") && collected.get("☑️")){
              if(max/2>collected.get("☑️").size)
                return `Проголосавало менее 50% людей в клане, <@${memb}> не становится владельцем клана ${Clan.name}`;
              Clan.addOwner(args[0]);
              return `Никто не голосовал против, <@${memb}> становится владельцем клана ${Clan.name}`
            }
            if(!collected.get("☑️") && collected.get("❌")){
              if(max/2>collected.get("❌").size)
                return `Проголосавало менее 50% людей в клане, <@${memb}> не становится владельцем клана ${Clan.name}`;
              return `Никто не голосовал за, <@${memb}> становится владельцем клана ${Clan.name}`
            }
            const yes = collected.get("☑️").users.size
            const no = collected.get("❌").users.size
            if(max/2>yes+no)
              return `Проголосавало менее 50% людей в клане, <@${memb}> не становится владельцем клана ${Clan.name}`;
            if(yes>no){
              Clan.addOwner(args[0]);
              return `Большая часть голосовавших голосовала за, <@${memb}> становится владельцем клана ${Clan.name}`
            } else
              return `Большая часть голосовавших голосовала против, <@${memb}> не становится владельцем клана ${Clan.name}`
          }
          message.channel.send(new Core.Discord.RichEmbed()
            .setTitle(`Голосование за добавление нового владельца клана ${Clan.name}`)
            .setFooter(`${Core.client.user.username} ${version} - Clan Vote`, Core.client.guild)
            .setColor("2ecc71")
            .setDescription(`Претендент на место владельца: <@${args[0]}>\nУсловия голосования: учитываются только те кто в этом клане, если проголосовало меньше 50% то добавление отменяется, для добавления необходимо чтоб более 50% голосовавших голосовало за добавление`)
          ).then(message=>{
            message.react("☑️").then(m=>message.react("❌"))
            message.awaitReactions(filter, {max: max, time: 300000, errors: ["time"]})
              .then(collected =>
                message.channel.send(new Core.Discord.RichEmbed()
                  .setTitle(`Результат голосования за добавление нового владельца клана ${Clan.name}`)
                  .setFooter(`${Core.client.user.username} ${version} - Clan Vote`, Core.client.guild)
                  .setColor("2ecc71")
                  .setDescription(voted(collected, args[0]))
                )
              )
              .catch(collected =>
                message.channel.send(new Core.Discord.RichEmbed()
                  .setTitle(`Результат голосования за добавление нового владельца клана ${Clan.name}`)
                  .setFooter(`${Core.client.user.username} ${version} - Clan Vote`, Core.client.guild)
                  .setColor("2ecc71")
                  .setDescription(voted(collected, args[0]))
                )
              );
          }).catch(e => msg.channel.send(`\`\`\`js\n${e}\`\`\``))
        } else msg.channel.send("Ты не глава клана")
      } else msg.channel.send("Ты не в клане")
    } else if(command == "voteRemoveOwner"){
      if(Clan.exists){
        if(Clan.checkOwner()){
          if(!Clan.members[args[0]])
            return message.channel.send("Его нет в клане")
          if(Clan.owners && !Clan.owners[args[0]])
            return msg.channel.send("Нельзя, он не владелец клана")
          const filter = (reaction, user) => {Clan.member = user; return user.id != Core.client.user.id && ['☑️', '❌'].includes(reaction.emoji.name) && Clan.checkOwner();};
          const max = Object.keys(Clan.owners).length;
          function voted(collected, memb){
            if(!collected.get("❌") && !collected.get("☑️"))
              return `Никто не голосовал, <@${memb}> не удаляется из владельцев клана ${Clan.name}`
            if(!collected.get("❌") && collected.get("☑️")){
              if(max/2>collected.get("☑️").size)
                return `Проголосавало менее 50% людей в клане, <@${memb}> не удаляется из владельцев клана ${Clan.name}`;
              Clan.removeOwner(args[0]);
              return `Никто не голосовал против, <@${memb}> удаляется из владельцев клана ${Clan.name}`
            }
            if(!collected.get("☑️") && collected.get("❌")){
              if(max/2>collected.get("❌").size)
                return `Проголосавало менее 50% людей в клане, <@${memb}> не удаляется из владельцев клана ${Clan.name}`;
              return `Никто не голосовал за, <@${memb}> не удаляется из владельцев клана ${Clan.name}`
            }
            const yes = collected.get("☑️").users.size
            const no = collected.get("❌").users.size
            if(max/2>yes+no)
              return `Проголосавало менее 50% людей в клане, <@${memb}> не удаляется из владельцев клана ${Clan.name}`;
            if(yes>no){
              Clan.removeOwner(args[0]);
              return `Большая часть голосовавших голосовала за, <@${memb}> удаляется из владельцев клана ${Clan.name}`
            } else
              return `Большая часть голосовавших голосовала против, <@${memb}> не удаляется из владельцев клана ${Clan.name}`
          }
          message.channel.send(new Core.Discord.RichEmbed()
            .setTitle(`Голосование за удаление владельца клана ${Clan.name}`)
            .setFooter(`${Core.client.user.username} ${version} - Clan Vote`, Core.client.guild)
            .setColor("2ecc71")
            .setDescription(`Претендент на удаление из владельцев владельца: <@${args[0]}>\nУсловия голосования: учитываются только те кто в этом клане, если проголосовало меньше 50% то добавление отменяется, для добавления необходимо чтоб более 50% голосовавших голосовало за добавление`)
          ).then(message=>{
            message.react("☑️").then(m=>message.react("❌"))
            message.awaitReactions(filter, {max: max, time: 300000, errors: ["time"]})
              .then(collected =>
                message.channel.send(new Core.Discord.RichEmbed()
                  .setTitle(`Результат голосования за удаление владельца клана ${Clan.name}`)
                  .setFooter(`${Core.client.user.username} ${version} - Clan Vote`, Core.client.guild)
                  .setColor("2ecc71")
                  .setDescription(voted(collected, args[0]))
                )
              )
              .catch(collected =>
                message.channel.send(new Core.Discord.RichEmbed()
                  .setTitle(`Результат голосования за удаление владельца клана ${Clan.name}`)
                  .setFooter(`${Core.client.user.username} ${version} - Clan Vote`, Core.client.guild)
                  .setColor("2ecc71")
                  .setDescription(voted(collected, args[0]))
                )
              );
          }).catch(e => msg.channel.send(`\`\`\`js\n${e}\`\`\``))
        } else msg.channel.send("Ты не глава клана")
      } else msg.channel.send("Ты не в клане")
    } else if(command == "viewPassword"){
      if(Clan.exists){
        message.author.send(Clan.password)
      } else msg.channel.send("Ты не в клане")
    } else if(command == "setPassword"){
      if(Clan.exists){
        if(Clan.checkOwner()){
          message.delete()
          let p = args.join()
          if(args.join()=="false")
            p=false
          Clan.setPassword(p)
        } else msg.channel.send("Ты не глава клана")
      } else msg.channel.send("Ты не в клане")
    } else if(command == "kick"){
      if(Clan.exists){
        if(Clan.checkOwner()){
          if(!Clan.members[args[0]]) return message.channel.send("Его нет в клане")
          if(Clan.owner && Clan.owner.id==msg.author.id)
            return msg.channel.send("Нельзя кикать себя")
          if(Clan.owners && Clan.owners[msg.author.id])
            return msg.channel.send("Нельзя, это другой владелец клана")
          message.channel.send(Clan.removeMember(args[0]))
        } else msg.channel.send("Ты не глава клана")
      } else msg.channel.send("Ты не в клане")
    } else if(command == "info"){
      const embed = new Core.Discord.RichEmbed()
        .setTitle(`О клане ${Clan.name}`)
        .setFooter(`${Core.client.user.username} ${version} - Clan Info`, Core.client.guild)
        .setColor("2ecc71")
        .addField("Название", Clan.name)
      if(Clan.creatorID)
        embed.addField("Создатель", `<@${Clan.creatorID}>`)
      else
        embed.addField("Создатель", `Неизвестно`)
      embed.addField("Дата создания", Clan.createdAt)
      if(typeof Clan.ownerID == typeof "")
        embed.addField("Владелец", `<@${Clan.ownerID}>`)
      else if(!Clan.ownerID)
        embed.addField("Владелец", "Никто")
      else
        embed.addField("Владельцы", `<@${Clan.ownerID.join("> <@")}>`)
      message.channel.send(embed);
    }else
      msg.channel.send("Команда не найдена, попробуй `" + prefix + "clans help`");
  } catch (e) {
    msg.channel.send(`\`\`\`js\n${e}\`\`\``);
  }
  if(!Core.Lib.fetchClan)
    Core.Lib.fetchClan = function(name,guil,member,channel){
      Core.client.guilds.get(guil).fetch().then(guild =>
         global.temp.Clan = new Clаn(name, guild, guild.members.get(member), true, guild.channels.get(channel))
      )
    }
};
module.exports.help = {
  regexp: ["[cCсС][lLiI][aAаА][nNпПиИ][sS5]", "[cCсС][lLiI][aAаА][nNпПиИ]", "[kKкК][пПлЛ][aAаА][hHнН][ыЫ]", "[kKкК][пПлЛ][aAаА][hHнН]"],
  name: "clans",
  group: "Stupid",
  description: "Клановая система"
};