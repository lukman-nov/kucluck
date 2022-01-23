const Discord = require("discord.js");
const config = require('../../botconfig/config.json');
const Swal = require('sweetalert2');

module.exports = (client, app, checkAuth) => {
  app.get("/terms", async (req, res) => {
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