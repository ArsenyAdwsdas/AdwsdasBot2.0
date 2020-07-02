class events{
  constructor(){
    const low = require("lowdb"),
      FileSync = require("lowdb/adapters/FileSync"),
      adapter = new FileSync("cooldown.json"),
      client = Core.client,
      botID = Core.botID,
      ownerID = Core.ownerID,
      vlad_server = Core.vlad_server,
      messagesBonuses = {}
    global.cdDB = low(adapter)
    cdDB.defaults({})
    global.force = function(mode, code) {
      global.servers=Core.client.guilds;
      global.users=Core.client.users;
      global.channels=Core.client.channels;
      global.servers=Core.client.guilds;
      global.users=Core.client.users;
      global.channels=Core.client.channels;
      Core.client.commands.map((m, ind) => `${ind}`).forEach(function(key) {
        if (Core.client.commands.get(key).force)
          Core.client.commands.get(key).force(mode, code);
      })
    };
    client.on("guildMemberRemove", function(member) {
      if (!(member.guild.id == vlad_server)) {
        let isArseny = member.user.id == ownerID,
          isNotArseny = !isArseny,
          channel = member.guild.channels.find(r => r.name == "уходы-приходы");
        if (channel) {
          if (isNotArseny)
            channel.send(member.user + " покинул сервер");
          else
            channel.send("Мой создатель покинул сервер...\n" + member.user);
        }
      }
    });
    client.on("guildMemberAdd", function(member) {
      if (!(member.guild.id == vlad_server)) {
        let isArseny = member.user.id == ownerID,
          isNotArseny = !isArseny,
          channel = member.guild.channels.find(r => r.name == "уходы-приходы");
        if (channel) {
          if (isNotArseny)
            channel.send(member.user + " зашел на сервер");
          else
            channel.send("Мой создатель зашел на сервер\n" + member.user);
        }
      }
    });
    client.on("ready", () => {
      Core.client.generateInvite(["ADMINISTRATOR"]).then(link => {console.log(link)});
      global.forceChannel = client.channels.get("704427701427110138");
      if (Core.bot_wip == true) {
        client.user.setPresence({ status: "dnd" });
        client.user.setPresence({game: { name: "WIP, " + prefix + "help", type: 2 }});
      } else {
        if (Core.bot_wip) {
          client.user.setPresence({ status: "dnd" });
          client.user.setPresence({game: {name: "Пытается успокоить Арсения, " + prefix + "help",type: 2}});
        } else
          client.user.setPresence({game: { name: "ACTIVE, " + prefix + "help", type: 3 }});
      }
      Object.keys(db7.getState()).forEach(function(key) {
        try {
          eval("Core.Lib[key] = " + db7.get(key).value());
        } catch (e) {
          console.log(e);
          console.log(key);
        }
      });
      try {
        Object.keys(db2.getState()).forEach(function(key) {
          eval('messagesBonuses["' + key + '"] = ' + db2.get(key).value());
        });
      } catch (e) {
        console.log(e);
      }
    });
    client.on("message", async message => {
      if(!cdDB.get(message.author.id).value())
        cdDB.set(message.author.id, Date.now()).write()
      if(((cdDB.get(message.author.id).value()/100000)-(Date.now()/100000))*100000>0)
        if(message.content.startsWith(prefix))return message.channel.send(`Остынь!! Подожди еще ${Core.Lib.timeFormat(((cdDB.get(message.author.id).value()/100000)-(Date.now()/100000))*100000)}`)
      if (message.guild && !message.guild.me.hasPermission("SEND_MESSAGES", {checkAdmin: true,checkOwner: true}) &&message.guild.owner.id!=Core.client.user.id)
        return
      Core.botID=client.user.id
      Core.botUsername=client.user.username
      global.ownerID = global.arsenyID = Core.ownerID;
      global.disabled = {};
      message.owner = message.author.id==ownerID;
      let args = message.content.split(" ");
      if (message.channel.type == "dm") return dm(message, args);
      ((client)=>{
        client.SPECIAL_commands.map((m, ind) => `${ind}`).forEach(function(key) {
          if (client.SPECIAL_commands.get(key).all00)
            client.SPECIAL_commands.get(key).all00(message, args);
        });
        client.SPECIAL_commands.map((m, ind) => `${ind}`).forEach(function(key) {
          if (client.SPECIAL_commands.get(key).all0)
            client.SPECIAL_commands.get(key).all0(message, args);
        });
        client.SPECIAL_commands.map((m, ind) => `${ind}`).forEach(function(key) {
          if (client.SPECIAL_commands.get(key).all)
            client.SPECIAL_commands.get(key).all(message, args);
        });
        client.commands.map((m, ind) => `${ind}`).forEach(function(key) {
          if (client.commands.get(key).onMessageRAW && !global.disabled[key])
            client.commands.get(key).onMessageRAW(message, args);
        });
      })(client)
      if (message.author.bot) return;
      client.commands.map((m, ind) => `${ind}`).forEach(function(key) {
        if (client.commands.get(key).onMessage && !global.disabled[key])
          client.commands.get(key).onMessage(message, args);
      });
      if(!new RegExp(prefixes).test(message.content.slice(null,2)))
        return
      args = message.content.slice(prefix.length).split(" ");
      let SPECIAL_cmd = client.SPECIAL_commands.get(args[0]);
      if (!message.owner) message.owner = false;
      if (SPECIAL_cmd) {
        message.send = message.channel.send
        SPECIAL_cmd.run(message, args);
      }
      let cmd0 = args.shift(),
        cmd = client.commands.get(cmd0);
      if (global.disabled[cmd0])
        cmd = false;
      let found=false
      client.commands.map((m, ind) => `${ind}`).forEach(function(key) {
        if (client.commands.get(key).run && !global.disabled[key]) {
          if(client.commands.get(key).help.regexp){
            let regexp = client.commands.get(key).help.regexp,
              activate = false
            if(typeof regexp == typeof "gag")
              activate = new RegExp(" "+regexp+" ").test(" "+cmd0+" ");
            else
              regexp.forEach((v)=>{
                if(new RegExp(" "+v+" ").test(" "+cmd0+" "))
                  activate = true
              })
            if(activate){
              message.send = message.channel.send
              client.commands.get(key).run(message, args);
              found = true;
            }
          }
        }
      });
      if (cmd&&!found) {
        if (cmd.run) {
          message.send = message.channel.send;
          if(!cmd.help.regexp)
            cmd.run(message, args);
        } else
          message.channel.send("Данный модуль существует но у него нету команд.");
      } else if (!SPECIAL_cmd&&cmd!==false&&!found)
        message.channel.send("Данного модуля не существует.");
    });
    function dm(message, args){
      if(message.author.id==botID)
        return
      global.servers=client.guilds
      global.users=client.users
      global.channels=client.channels
      client.commands.map((m, ind) => `${ind}`).forEach(function(key) {
        if (client.commands.get(key).onMessageDM)
          client.commands.get(key).onMessageDM(message, args);
      });
      if(!message.content.startsWith(prefix))
        return
      let cmd0 = args.shift().slice(prefix.length),
        cmd = client.commands.get(cmd0);
      if (cmd) {
        if (cmd.runDM)
          cmd.runDM(message, args);
        else
          message.channel.send("Данный модуль существует но у него нету команд в личку.");
      } else
        message.channel.send("Данного модуля не существует.");
    }
    function dmUpdate(newMessage, args, oldMessage){
      if(newMessage.author.id==botID)
        return
      global.servers=client.guilds
      global.users=client.users
      global.channels=client.channels
      client.commands.map((m, ind) => `${ind}`).forEach(function(key) {
        if (client.commands.get(key).onMessageUpdateNoCMD_DM)
          client.commands.get(key).onMessageUpdateNoCMD_DM(newMessage, args, oldMessage);
      });
      if(!newMessage.content.startsWith(prefix))
        return
      let cmd0 = args.shift().slice(prefix.length),
        cmd = client.commands.get(cmd0);
      if (!newMessage.owner) {
        newMessage.owner = false;
      }
      if (cmd) {
        if (cmd.onMessageUpdateDM)
          cmd.onMessageUpdateDM(newMessage, args, oldMessage);
        else
          newMessage.channel.send("Данный модуль существует но у него нету команд в личку реагирующих на обновление сообщения.");
      } else if(cmd!==false)
        newMessage.channel.send("Данного модуля не существует.");
    }
    client.on("messageUpdate", async function(oldMessage, newMessage) {
      global.disabled = {};
      let args = newMessage.content.split(" ");
      newMessage.owner = newMessage.author.id == ownerID;
      if (newMessage.channel.type == "dm")
        return dmUpdate(newMessage, args, oldMessage);
      if (newMessage.author.bot)
        return;
      client.SPECIAL_commands.map((m, ind) => `${ind}`).forEach(function(key) {
        if (client.SPECIAL_commands.get(key).all00)
          client.SPECIAL_commands.get(key).all00(newMessage, args);
        if (client.SPECIAL_commands.get(key).all0)
          client.SPECIAL_commands.get(key).all0(newMessage, args);
        if (client.SPECIAL_commands.get(key).all)
          client.SPECIAL_commands.get(key).all(newMessage, args);
      });
      client.commands.map((m, ind) => `${ind}`).forEach(function(key) {
        if (client.commands.get(key).onMessageUpdateNoCMD && !global.disabled[key])
          client.commands.get(key).onMessageUpdateNoCMD(newMessage, args, oldMessage);
      });
      if (!(newMessage.content.startsWith(prefix) || newMessage.content.startsWith(prefix2)))
        return;
      args = newMessage.content.slice(prefix.length).split(" ");
      if (!global.owner) global.owner = false;
      let cmd0 = args.shift(),
        cmd = client.commands.get(cmd0);
      if (global.disabled[cmd0]) cmd = false;
      if (cmd) {
        if (cmd.onMessageUpdate) {
          newMessage.send = newMessage.channel.send;
          cmd.onMessageUpdate(newMessage, args, oldMessage);
        } else
          newMessage.channel.send("Данный модуль существует но у него нету команд реагирующих на редактирование сообщения.");
      } else
        newMessage.channel.send("Данного модуля не существует.");
    });
  }
};new events()