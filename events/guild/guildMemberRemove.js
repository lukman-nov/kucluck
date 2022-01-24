const {
  MessageEmbed
} = require('discord.js');
const ee = require('../../botconfig/embed');
const settings = require('../../botconfig/settings.json');
const emoji = require('../../botconfig/emojis.json');
const GreetingSchema = require('../../databases/greetingmsg');

module.exports = async (client, member) => {
  let guild = client.guilds.cache.get(member.guild.id);
  let ss = await client.Settings.findOne({
    GuildId: member.guild.id
  });
  let es = ss.Embed;
  let ls = ss.Language;

  if (ss.leaveMessage) {
    client.leaveMessage.findOne({
      GuildId: member.guild.id
    }, async (err, data) => {
      if (!data) return;
      const channel = await member.guild.channels.cache.get(data.ChannelId);
      var msg = await data.Message;
      if (msg === null) return;

      function handlemsg(txt, options) {
        let text = String(txt);
        for (const option in options) {
          var toreplace = new RegExp(`%${option}%`, "ig");
          text = text.replace(toreplace, options[option]);
        }
        return text;
      }
      channel.send(handlemsg(msg, {
        mention: member,
        guild: member.guild.name,
      }))
    });
  }
}