const Discord = require('discord.js')
const config = require('../../botconfig/config.json');
module.exports = (client, app, checkAuth) => {
  app.get("/errorlogin", (req, res) => {
    res.render("errorlogin", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
    })
  })

  app.get("/errornotinguild", (req, res) => {
    res.render("errornotinguild", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
    })
  })
  app.get("/error404", (req, res) => {
    res.render("error404", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
    })
  })
}