//here the event starts
const config = require(`${process.cwd()}/botconfig/config.json`);
const Discord = require("discord.js")
const moment = require("moment")
const MCSchema = require('../../databases/memberCount');
const messageTimer = require('../../databases/messageTimer');
module.exports = client => {
  setInterval(() => {
    MCSchema.find().then((data) => {
      if (!data && !data.length) return;

      data.forEach((value) => {
        const guild = client.guilds.cache.get(value.GuildId);
        const memberCount = guild.memberCount;

        if (value.Member != memberCount) {
          client.logger(`The member count differs in ${guild.name}`)
          const channel = guild.channels.cache.get(value.ChannelId);
          channel.setName(`👤 Members: ${memberCount}`);
          value.Member = memberCount;
          value.save();
        }
      });
    });
  }, 5000);
  try {
    client.logger(
      `Bot User: `.brightBlue + `${client.user.tag}`.blue + `\n` +
      `Bot Version: `.brightBlue + `v${require('../../package.json').version}`.blue + `\n` +
      `Guild(s): `.brightBlue + `${client.guilds.cache.size} Servers`.blue + `\n` +
      `Watching: `.brightBlue + `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`.blue + `\n` +
      `Prefix: `.brightBlue + `${config.prefix}`.blue + `\n` +
      `Commands: `.brightBlue + `${client.commands.size}`.blue + `\n` +
      `Discord.js: `.brightBlue + `v${Discord.version}`.blue + `\n` +
      `Node.js: `.brightBlue + `${process.version}`.blue + `\n` +
      `Plattform: `.brightBlue + `${process.platform} ${process.arch}`.blue + `\n` +
      `Memory: `.brightBlue + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`.blue
    );

    change_status(client);
    setInterval(() => {
      change_status(client);
    }, 60000);

  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
  // messageTimer.find({}, async (err, data) => {
  //   data.forEach(async (value) => {
  //     let guilds = client.guilds.cache.get(value.GuildId)
  //     if (!guilds || guilds.length == 0) return;
  //     try {
  //       let guild = client.guilds.cache.get(guilds.id);
  //       if (!guild) return client.logger(`Message Timer`.brightCyan + ' - Guild Not Found!')
  //       if (value.Status) {
  //         let channel = guild.channels.cache.get(value.ChannelId);
  //         if (!channel) {
  //           await messageTimer.findOneAndDelete({
  //             GuildId: guild.id
  //           })
  //           return client.logger(`Message Timer`.brightCyan + ` - Channel not found in ${String(guild.name).brightBlue} remove a data from databases!`)
  //         }
  //         if (!value.Timer) {
  //           await messageTimer.findOneAndDelete({
  //             GuildId: guild.id
  //           })
  //           return client.logger(`Message Timer`.brightCyan + ` - Timer not found in ${String(guild.name).brightBlue} remove a data from databases!`)
  //         }
  //         if (!value.Message) {
  //           await messageTimer.findOneAndDelete({
  //             GuildId: guild.id
  //           })
  //           return client.logger(`Message Timer`.brightCyan + ` - Message not found in ${String(guild.name).brightBlue} remove a data from databases!`)
  //         }
  //         setInterval(() => {
  //           channel.send(value.Message)
  //           return client.logger(`Message Timer`.brightCyan + ` - Sending in ${String(guild.name).brightBlue} to ${String(channel.name).brightBlue}`)
  //         }, value.Timer);
  //       } else {
  //         if (value.ChannelId.length > 10) client.logger(`Message Timer`.brightCyan + ` - Status off in ${String(guild.name).brightBlue} Not Sending Message Timer`)
  //       }
  //     } catch (e) {
  //       console.log(String(e.stack).grey)
  //     }
  //   })
  // }).clone();
}
var state = false;

function change_status(client) {
  if (!state) {
    state = !state;
    client.user.setActivity(`${config.status.text}`
      .replace("{prefix}", config.prefix)
      .replace("{guildcount}", client.guilds.cache.size)
      .replace("{membercount}", client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))
      .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
      .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
      .replace("{name}", client.user.username)
      .replace("{tag}", client.user.tag)
      .replace("{commands}", client.commands.size)
    );
  } else {
    client.user.setActivity(`${config.status.text2}`
      .replace("{prefix}", config.prefix)
      .replace("{guildcount}", client.guilds.cache.size)
      .replace("{membercount}", client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))
      .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
      .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
      .replace("{name}", client.user.username)
      .replace("{tag}", client.user.tag)
      .replace("{commands}", client.commands.size)
    );
  }
}