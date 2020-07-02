class core00{
  constructor() {
    this.starting = global.starting
    delete global.starting
    this.vlad_server = "538018429748379668";
    this.bot_wip = false; //"ANGRY"
    this.Discord=require("discord.js");
    this.client = new this.Discord.Client({ fetchAllMembers: true });
    this.client.commands = new this.Discord.Collection();
    this.client.SPECIAL_commands = new this.Discord.Collection();
    this.fs=require("fs")
    this.arsenyID = "347820978111250433";
    this.ownerID = this.arsenyID
    Object.keys(db6.getState()).forEach(key=>eval(db6.get(key).value()));
    this.fs.readdir("./cmds/", (err, files) => {
      if (err) console.log(err);
      let jsfiles = files.filter(f => f.split(".").pop() === "js");
      if (jsfiles.length <= 0) console.log("Нет команд для загрузки!!");
      let errored = 0
      jsfiles.forEach((f, i) => {
        try {
          let props = require(`../cmds/${f}`);
          this.client.commands.set(props.help.name, props);
          if (typeof props.runtime == "function") props.runtime()
          console.log(`${i + 1}.${f} Загружен!`);
        } catch (e) {
          errored = errored+1
          console.log(e);
        }
      });
      console.log(`Загружено ${jsfiles.length-errored} обычных модулей\n${errored} не удалось загрузить`);
    });
    this.fs.readdir("./special/", (err, files) => {
      if (err) console.log(err);
      let jsfiles = files.filter(f => f.split(".").pop() === "js");
      if (jsfiles.length <= 0) console.log("Особых модулей для загрузки не найдено")
      let errored = 0
      jsfiles.forEach((f, i) => {
        try {
          let props = require(`../special/${f}`);
          this.client.SPECIAL_commands.set(props.help.name, props);
          if (typeof props.runtime == "function") props.runtime();
          console.log(`${i + 1}.${f} Загружен!`);
        } catch (e) {
          errored = errored+1
          console.log(e);
        }
      });
      console.log(`Загружено ${jsfiles.length-errored} особых модулей\n${errored} не удалось загрузить`);
    })
    this.fs.readdir("./coreLoad/", (err, files) => {
      if (err) console.log(err);
      let jsfiles = files.filter(f => f.split(".").pop() === "js");
      if (jsfiles.length <= 0) console.log("Загрузочных модулей не найдено");
      jsfiles.forEach((f, i) => {
        try {
          require(`../coreLoad/${f}`);
          console.log(`${i + 1}.${f} Загружен!`);
        } catch (e) {
          console.log(e);
        }
      });
    });
    this.client.login(process.env.TOKEN)
    this.loaded = Date.now()
    console.log(`Запуск занял ${this.loaded-this.starting} ms`)
  }
};global.Core = new core00()
setTimeout(()=>{Core.Lib=Lib;delete global.Lib},10)