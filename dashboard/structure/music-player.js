const Discord = require('discord.js')
const {
  formatNonSeconds,
  musicSystem,
  databasing,
} = require("../../handlers/functions");
const {
  generateQueueEmbed
} = require('../../handlers/erela_events/musicsystem');
const greetingmsgSchema = require('../../databases/greetingmsg');
const leavemessageSchema = require('../../databases/leaveMessage');
const autoresume = require('../../databases/autoresume');
const config = require('../../botconfig/config.json');
module.exports = (client, app, checkAuth) => {
  app.get("/dashboard/:guildID/musicplayer", async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) return res.redirect('/errornotinguild')
    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        member = await guild.members.fetch(req.user.id);
      } catch {}
    }
    if (!member)
      return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
    if (!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
      return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))
    res.render("dashboard/music-player", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      guild: guild,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: config.websiteSettings,
      callback: config.websiteSettings.callback,
      format: formatNonSeconds,
      settingsSchema: await client.Settings.findOne({
        GuildId: guild.id
      }),
      premium: await client.Premium.findOne({
        GuildId: guild.id
      }),
      player: client.manager.players.get(guild.id),
      musicsettings: await client.Musicsettings.findOne({
        guildId: guild.id
      }),
    })
  });
}