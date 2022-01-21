const Discord = require("discord.js");
const config = require('../../botconfig/config.json');
const Swal = require('sweetalert2');

module.exports = (client, app, checkAuth) => {
  app.get("/terms", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) return res.redirect('/errorlogin')
    if (!req.user.guilds) return res.redirect("/?error=" + encodeURIComponent("Cannot get your Guilds"))
    res.render("terms", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: config.websiteSettings,
      callback: config.websiteSettings.callback,
    })
  })
}