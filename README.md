# AdwsdasBot

"bot.js" loads files in "startup/" and "startup/Core.js" loads files in "cmds/", "special/", "coreLoad/"
- "coreLoad/" contains things that load after "startup/Core.js" has loaded other things

Modules:

- "special/" is for special modules that affect all normal modules like disable some or change message.content
- "cmds/" contains normal modules

"coreLoad/events.js" does all logic for Discord messages and then decides which modules should be activated

Groups for modules:
- "coreLoad/groups.js" sorts ALL modules like "Core.client.groups.modules.NIL.grouped" and "Core.client.groups.modulesS.NIL.grouped"
- "cmds/groupsShow.js" will show these groups