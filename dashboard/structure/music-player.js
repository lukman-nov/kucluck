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
  app.get("/musicplayer/:guildID", async (req, res) => {
    const guild = await client.guilds.cache.get(req.params.guildID)
    if (!guild) return res.redirect('/errornotinguild')
    res.render("dashboard/music-player", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      guild: guild,
      bot: client,
      botconfig: config.websiteSettings,
      callback: config.websiteSettings.callback,
      format: formatNonSeconds,
      settingsSchema: await client.Settings.findOne({
        GuildId: guild.id
      }),
      premium: await client.Premium.findOne({
        GuildId: guild.id
      }),
      musicsettings: await client.Musicsettings.findOne({
        guildId: guild.id
      }),
    })
  });
  app.post("/musicplayer/:guildID", async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID)
    let player = client.manager.players.get(guild.id);
    if (player) {
      if (req.body.clearqueue) {
        player.queue.clear();
      }
    }
  })
}