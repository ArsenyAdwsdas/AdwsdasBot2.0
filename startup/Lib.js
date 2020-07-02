const { startDownload } = require("su-downloader3");
const path = require("path");
class Lib{
  constructor() {
    this.low = require("lowdb")
    this.FileSync = require("lowdb/adapters/FileSync");
    const adapter = new this.FileSync(".data/Idiotico.json");
    this.IdioticoDB = this.low(adapter);
    this.IdioticoDB.defaults({"n":"п","a":"а","A":"А","p":"р","P":"Р","t":"т","T":"Т","b":"ь","B":"В","y":"у","Y":"У","G":"6","S":"5","o":"о","O":"О","k":"к","K":"К","h":"н","H":"Н","e":"е","E":"Е","x":"х","X":"Х","c":"С"}).write()
    this.util=require("util");
    this.fs=require("fs");
    this.safeEval = require("safe-eval");
    this.startDownload = startDownload
    this.path = path
    this.ifElse = function(...Args){
      if(Args.length<=1)
        return 'given (accessible in eval as given): {`${name}`: `${value}`}, any number of {if: `${if(eval(if))return do}`, do: `${return eval(do)}`}'
      const given = Args.shift()
      const exec = Args.map(v => `if(eval(${v.if})) ${v.do}`).join('; else ')
      return eval(exec)
    }
    this.rusishFormatTime = function (date){
      const time = JSON.stringify(date).split("T")
      time[1]=time[1].split(".")[0]
      time[0]=time[0].split(/\-/g).reverse().join(".").replace(/\"/g,"")
      return `${time.join(" ")} UTC+00:00`
    }
    this.rusishFormatTimeI = function (time){
      const date = time.split(/ /g)
      delete date[2]
      date[0] = date[0].split(".").reverse().join("-").replace(/\"/g,"")
      date[1]=`${date[1]}.00Z`
      return new Date(Date.parse(date))
    }
    this.switchKV = function(a){
      let b = {}
      Object.keys(a).forEach(k=>{
        b[a[k]]=k
      })
      return b
    }
    global.replaceObject = function(b, a){
      let toReturn=b,
        keys = Object.keys(a);
      keys.forEach(k=>{
        toReturn = toReturn
                   .replace(
        new RegExp(`${k.replace(/\]/g,"\\]")
                   .replace(/\(/g,"\\(")
                   .replace(/\)/g,"\\)")
                   .replace(/\[/g,"\\[")}`, 'g'), a[k])
      })
      return toReturn
    }
    this.replaceObject = replaceObject
    this.add = function(name, func) {
      db7.set(name, func.toString()).write();
      Lib[name] = func;
      return "✅";
    };
    this.getRandomInt = function(init, range_end, seedq) {
      let range_endq = range_end - init;
      if(!seedq)seedq = now;
      seedq = Math.pow(range_endq ^ (seedq ^ init), 1.1);
      let fsaijfan = Math.round(seedq) % range_endq;
      return fsaijfan + init;
    };
    this.factorial=function(a){
      let inverse=1,
        b=1;
      if(a<1){
        inverse=0-1;
        a=-a;b=b*-1
      };
      for(var i=1;i<a+1;i++){
        b=b*i*inverse
      };
      return b
    }
    this.close = function() {
      Core.client.destroy()
    }
    this.downloadFrom = function(url, filename) {
      const savePath = this.path.join(__dirname, filename),
        locations = { url, savePath },
        options = {threads: 3,throttleRate: 500};
      this.startDownload(locations, options).subscribe({next: progressInfo => console.log(progressInfo),error: e => console.log(e.red),complete: () => console.log("download has completed!")});
    };
    this.extend = function(src, obj) {
      Object.keys(obj).forEach(function(key) {src[key] = obj[key];});
      return src;
    };
    this.compress = function (c){
      var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;
      for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);
      d.push(1<a.length?e[a]:a[x](0));
      for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);
      return d.join("")
    }
    this.decompress = function (b){
      var a,e={},d=b.split(""),c=f=d[0],g=[c],h=o=256;
      for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;
      return g.join("")
    }
    this.chunkString = function(str, length) {
      if(typeof str != "fasf"){
        let toReturn = [];
        Object.keys(str).forEach(k=>{
          let x00 = str[k].match(new RegExp(".{1," + length + "}", "g"));
          Object.keys(x00).forEach(k00=>toReturn[toReturn.length] = x00[k00])
        });
        return toReturn
      } else return str.match(new RegExp(".{1," + length + "}", "g"));
    };
    this.timeLoop=function (func, i, max, time, args){
      setTimeout(() => {
        func(i,args);
        if(i<max)timeLoop2(func,i+1,max,time,args)
      }, time);
    }
    const timeLoop2=function (func, i, max, time, args){
      setTimeout(() => {
        func(i,args);
        if(i<max)this.timeLoop(func,i+1,max,time,args)
      }, time);
    }
    this.timeFormat = function(ms) {
      ms = ms-(ms%1);
      let sec = ms/1000;
      ms = sec%1;
      sec = sec-ms;
      ms = ms*1000;
      let seconds = sec%(60),
        minutes = sec/60-(sec/60%1),
        hours = minutes/60-(minutes/60%1);
      minutes = minutes%60;
      return `${hours}\`hrs\`:${minutes}\`mins\`:${seconds}\`secs\`:${Math.round(ms)}\`ms\``
    }
    this.arrayKeysObject = function(arr){
      let arr2 = {};
      arr.forEach((v)=>arr2[v]=true);
      return arr2
    }
    this.chunkStringLines = function(str, length) {
      var z = str.split("\n");
      var x = [];x[0] = z[0];
      var curr = 0;
      for (var i = 0; i < z.length; i++) {
        if (x[curr] && z[i + 1] && x[curr].length + "\n".length + z[i + 1].length < length) 
          x[curr] = x[curr] + "\n" + z[i + 1];
        else {
          curr = curr + 1;
          x[curr] = z[i + 1];
        }
      };
      x.pop();
      let deleted = 0;
      Object.keys(x).forEach(k=>{
        if(x[k-deleted]=="")x.splice(k-deleted,1)
      });
      return x;
    };
    this.rusish=function(a){
      let b = "Да фиг знает ваще че это";
      if(a==true)b="Да";
      else if(a==false)b="Нет";
      else if(typeof a==typeof 41||typeof a==typeof "gag")b=a;
      else if(a==null||a==undefined)b="Ничего... 1 умножить на 0 так сказать.";
      return b
    }
    this.раскладка=function(a){
      let replacer = {"q":"й", "w":"ц","e":"у","r":"к", "t":"е", "y":"н", "u":"г","i":"ш", "o":"щ", "p":"з" , "[":"х" , "]":"ъ", "a":"ф", "s":"ы","d":"в" , "f":"а"  , "g":"п" , "h":"р" , "j":"о", "k":"л", "l":"д",";":"ж" , "'":"э"  , "z":"я", "x":"ч", "c":"с", "v":"м", "b":"и","n":"т" , "m":"ь"  , ",":"б" , ".":"ю" , "/":"."},
        eng = Object.keys(replacer),
        rus = Object.values(replacer),
        str = a.split("")
      for(let i = 0; i < str.length; i++){
        if(rus.find(x => x === str[i].toLowerCase()) || eng.find(x => x === str[i].toLowerCase())) {
          let rusfind = rus.find(x => x === str[i].toLowerCase())
          let engfind = eng.find(x => x === str[i].toLowerCase())
          let rstr
          if(rusfind) rstr = eng[rus.findIndex(x => x === str[i].toLowerCase())]
          else rstr = replacer[engfind]
          if(str[i] !== str[i].toLowerCase()) rstr = rstr.toString().toUpperCase()
          if(rusfind || engfind) str[i] = rstr
        } else if(str[i].toLowerCase() === 'ё') str[i] = (str[i] === str[i].toLowerCase()?'t':'T')
      }
      return str.join('')
    }
    this.toIdiotico=function(a){
      return this.replaceObject(this.раскладка(a), this.IdioticoDB.getState())
    }
    this.fromIdiotico=function(a){
      return this.раскладка(this.replaceObject(a, this.switchKV(this.IdioticoDB.getState())))
    }
    
    
    this.settings = {}
    
    this.settings.help = function() {
      return new Core.Discord.RichEmbed()
        .setColor("2ecc71")
        .setTitle("Помощь по настройке")
        .setThumbnail(Core.client.user.avatarURL)
        .setFooter(`${Core.client.user.username} ` + version + " - Settings")
        .addField("<настройка>", "Название настройки из **list**")
        .addField("<значение>", "Новое значение для настройки")
        .addField("Значение: boolean", "true это включить, false это выключить")
        .addField("Значение: string", "Просто текст")
        .addField("Значение: null", "Как string только надо написать `null`, вместо null можно писать `nil`... Обозначает НИЧЕГО")
        .addField("Значение: int", "Число без дробных частей, если в определенном радиусе то написано **[min, max]** где min это минимальное число, max это максимальное")
        .addField("Значение: double", "Любое число, если в определенном радиусе то написано **[min, max]** где min это минимальное число, max это максимальное")
    }
    
    this.settings.list = function (list) {
      const embed = new Core.Discord.RichEmbed()
        .setColor("2ecc71")
        .setTitle("Список настроек")
        .setThumbnail(Core.client.user.avatarURL)
        .setFooter(`${Core.client.user.username} ` + version + " - Settings")
      Object.keys(list).forEach(k=>{
        embed.addField(k, `${list[k].desc}\nЗначения: ${list[k].value}`);
      })
      return embed
    }
    
    this.settings.set = function (list, got, message, args, db) {
      if(message.guild.owner.id!=message.author.id&&!message.owner)
        return "Ошибка: Тебе нельзя это использовать"
      if(!list[got])
        return `Ошибка: Параметр ${got} не найден`
      let valueType
      if(args[0]==="true"){
        args=[true]
        valueType = "boolean"
      }else if(args[0]==="false"){
        args=[false]
        valueType = "boolean"
      }else if(!isNaN(parseInt(args[0]))){
        if(parseInt(args[0])<list[got].max&&parseInt(args[0])>list[got].min){
          args = [parseInt(args[0])]
          valueType = "int"
        } else {
          args = ["Число За Границей Разрешенного"]
          valueType = "ОШИБКА"
        }
      }else if(!isNaN(Number(args[0]))){
        if(Number(args[0])<list[got].max&&Number(args[0])>list[got].min){
          args = [Number(args[0])]
          valueType = "double"
        } else {
          args = ["Число За Границей Разрешенного"]
          valueType = "ОШИБКА"
        }
      }
      let value = args[0]
      if(args[1])
        value = args.join(" ")
      if(value=="null"||value=="nil"){
        value=null
        valueType = "null"
      }
      if(list[got].values[valueType]){
        db.set(`settings.${message.guild.id}.${got}`, value).write()
        return `Значение изменено`
      }
      else
        return `Ошибка: Неправильное значение, ожидалось \`${list[got].value}\`, получено \`${valueType}\` со значением \`${value}\``
    }
    
    this.settings.get = function (search, db, id) {
      return db.get(`settings.${id}.${search}`).value()
    }
  }
};global.Lib = new Lib()