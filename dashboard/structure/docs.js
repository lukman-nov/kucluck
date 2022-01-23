const Discord = require('discord.js')
const config = require('../../botconfig/config.json');
const {
  duration,
} = require(`${process.cwd()}/handlers/functions`);
module.exports = (client, app, checkAuth) => {
  let categoryresult = client.categories.filter(name => name != 'Owner')
  app.get("/docs", async (req, res) => {
    res.render("docs", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      config: config,
      callback: config.websiteSettings.callback,
      categories: categoryresult,
      commands: client.commands,
      owner: client.users.cache.get('377636455016824834'),
      version: require('../../package.json').version,
      Discord: Discord,
      duration: duration,
      stats: await client.statsGlobal.findOne({
        BotId: client.user.id
      }),
    })
  })
}