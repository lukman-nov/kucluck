const Discord = require('discord.js');
const messageTimer = require('../databases/messageTimer');
module.exports = async (client) => {
  messageTimer.find({}, async (err, data) => {
    data.forEach(async (value) => {
      let guilds = client.guilds.cache.get(value.GuildId)
      if (!guilds || guilds.length == 0) return;
      try {
        let guild = client.guilds.cache.get(guilds.id);
        if (!guild) return client.logger(`Message Timer`.brightCyan + ' - Guild Not Found!')
        if (value.Status) {
          let channel = guild.channels.cache.get(value.ChannelId);
          if (!channel) {
            await messageTimer.findOneAndDelete({
              GuildId: guild.id
            })
            return client.logger(`Message Timer`.brightCyan + ` - Channel not found in ${String(guild.name).brightBlue} remove a data from databases!`)
          }
          if (!value.Timer) {
            await messageTimer.findOneAndDelete({
              GuildId: guild.id
            })
            return client.logger(`Message Timer`.brightCyan + ` - Timer not found in ${String(guild.name).brightBlue} remove a data from databases!`)
          }
          if (!value.Message) {
            await messageTimer.findOneAndDelete({
              GuildId: guild.id
            })
            return client.logger(`Message Timer`.brightCyan + ` - Message not found in ${String(guild.name).brightBlue} remove a data from databases!`)
          }
          setInterval(() => {
            channel.send(value.Message)
            return client.logger(`Message Timer`.brightCyan + ` - Sending in ${String(guild.name).brightBlue} to ${String(channel.name).brightBlue}`)
          }, value.Timer);
        } else {
          if (value.ChannelId.length > 10) client.logger(`Message Timer`.brightCyan + ` - Status off in ${String(guild.name).brightBlue} Not Sending Message Timer`)
        }
      } catch (e) {
        console.log(String(e.stack).grey)
      }
    })
  }).clone();
}