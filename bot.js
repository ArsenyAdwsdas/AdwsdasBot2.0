global.starting = Date.now()
const express = require("express"),
  bodyParser = require("body-parser"),
  app = express()/*,
  arsenyIP = process.env.arsenyip;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.get("/", (request, response) => response.sendFile(`${__dirname}/views/index.html`));
app.post("/addDream", (request, response) => {
  const code = request.body.code,
    mode = request.body.mode,
    ip = request.header("x-forwarded-for") || request.connection.remoteAddress
  console.log(mode);console.log(code);
  console.log(ip);console.log(ip.includes(arsenyIP));
  if(ip.includes(arsenyIP))
    force(mode, code);
});
var listener = app.listen(process.env.PORT, () => console.log(`Your app is listening on port ${listener.address().port}`));*/
const fs = require("fs");
fs.readdir("./startup/", (err, files) => {
  if (err) console.log(err);
  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if (jsfiles.length <= 0) console.log("Загрузочных модулей не найдено");
  jsfiles.forEach((f, i) => {
    try {
      require(`./startup/${f}`);
      console.log(`${i + 1}.${f} Загружен!`);
    } catch (e) {console.log(e);}
  });
});
const http = require("http");
const keepalive = require("express-glitch-keepalive");
app.use(keepalive);
app.get("/", (req, res) => res.json("Ok"));
const low = require("lowdb"),
  FileSync = require("lowdb/adapters/FileSync"),
  adapter = new FileSync(".data/database.json"),
  adapter2 = new FileSync("functions.json"),
  adapter3 = new FileSync("cmds/rank.json"),
  adapter4 = new FileSync("allowed.json"),
  adapter5 = new FileSync("nicks.json"),
  adapter6 = new FileSync("runtime.json"),
  adapter7 = new FileSync("dbLib.json");
global.db = low(adapter);
global.db2 = low(adapter2);
global.db3 = low(adapter3);
global.db4 = low(adapter4);
global.db5 = low(adapter5);
global.db6 = low(adapter6);
global.db7 = low(adapter7);
db.defaults({"messages":{"adwsdasbot тест":"завершен","adwsdasbot какой твой любимый цвет?":"Лаймовый","adwsdasbot ты приемный":"Сам такой","adwsdasbot кто я":"Кто-то незнающий кто он","adwsdasbot ты кот":"Возможно)","adwsdasbot ты кот?":"Возможно)","adwsdasbot ты даун":"Сам такой","adwsdasbot za warudo":"ПШЕЛ НАФИГ","adwsdasbot пошел нафиг":"САМ ПОШЕЛ","adwsdasbot сам пошел":"nil","adwsdasbot я тебя забаню":"И?","adwsdasbot всо":"nil","adwsdasbot ты лох":"Cам такой","adwsdasbot лох":"Cам такой","adwsdasbot дмитрий гей":"nil","adwsdasbot дурачок":"Сам такой","adwsdasbot быдло ли котовасик?":"нет","adwsdasbot быдло ли евча":"возможно)","adwsdasbot котовас тупой или нет":"нет)","adwsdasbot доброе утро":"И тебе доброе утро","adwsdasbot я тупой?":"кто знает...","adwsdasbot как дела?":"как обычно","adwsdasbot расскажи о своем создателе":"ArsenyAdwsdas (Арсений) создал меня с помощью JavaScript и Discord.js (он хотел перевести меня на Java, потом C++, потом Lua, но он не придумал как это сделать)\nCreator","adwsdasbot мне сожрать 544031928358273045?":"если он тебя не сожрет то попробуй","блять сдохни тварь adwsdasbot":"само сдохни","adwsdasbot тест2":"завершен","adwsdasbot где я":"а фиг знает ваще","adwsdasbot лысый?":"нет","adwsdasbot лысый":"нет","adwsdasbot где ты?":"а фиг знает ваще","adwsdasbot где я?":"а фиг знает ваще","adwsdasbot живой?":"наверное","adwsdasbot где дурка?":"где-то рядом с тобой сидит","adwsdasbot кто?":"nil","adwsdasbot":"ну пропиши хоть A!help я так полагаю"},"ban-words":{"джо":1,"джоджо":1,"джо-джо":1,"гей":1,"пизда":1,"минет":1}})
db4.defaults({summon: { "347820978111250433": true }}).write();
db5.defaults({}).write();
db6.defaults({}).write();
db7.defaults({}).write();
global.prefixes = ["[AaаА][\\~\\!\\-\\=\\+\\&\\$\\#\\1]"];
global.prefix = "A!";
global.prefix2 = "A-";
global.now = new Date().getTime();
global.temp = {};
global.dbs = {db:db,db2:db2,db3:db3,db4:db4,db5:db5,db6:db6,db7:db7};
global.version = "Version `NaN.NaN.NaN`";
console.log("...");

/*const Discord = require("discord.js");
const client = new Discord.Client({ fetchAllMembers: true });
client.login(process.env.TOKEN);
client.fetchUser("347820978111250433").send("ОЖИЛО НА#УЙ")*/