const Discord = require("discord.js");
const Settings = require("../settings.json");
const config = require('../../botconfig/config.json');
const Swal = require('sweetalert2');

module.exports = (client, app, checkAuth) => {
  app.get("/payment", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) return res.redirect('/errorlogin')
    if (!req.user.guilds) return res.redirect("/?error=" + encodeURIComponent("Cannot get your Guilds"))
    res.render("payment", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: Settings.website,
      callback: Settings.config.callback,
    })
  })
  app.get("/payment/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) return res.redirect("/?error=" + encodeURIComponent("I am not in this Guild yet, please add me before!"))
    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        member = await guild.members.fetch(req.user.id);
      } catch {

      }
    }
    if (!member) return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
    if (!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))
    let premium = await client.Premium.findOne({ GuildId : guild.id});
    res.render("paymentIDR", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: Settings.website,
      callback: Settings.config.callback,
      guild: guild,
      premium: premium,
    })
  })
  app.post("/payment/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild)
    return res.redirect('/errorNotInGuild')
    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        member = await guild.members.fetch(req.user.id);
      } catch {

      }
    }
    if (!member) return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
    if (!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))
    let premium = await client.Premium.findOne({ GuildId : guild.id});
    const guildReport = client.guilds.cache.get('901445288881963059');
    const channelReport = guildReport.channels.cache.get('907178977758674984');
    const file = new Discord.MessageAttachment(req.body.proofofpayment);
    res.render("paymentIDR", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: Settings.website,
      callback: Settings.config.callback,
      guild: guild,
      premium: premium,
    })
  })
  app.post("/paymentgate", async (req, res) => {
    const guild = client.guilds.cache.get(req.body.guildid)
    if (!guild)
    return res.redirect('/errorNotInGuild')
    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        member = await guild.members.fetch(req.user.id);
      } catch {

      }
    }
    if (!member) return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
    if (!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))
    let premium = await client.Premium.findOne({ GuildId : guild.id});

    res.render("paymentgate", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: Settings.website,
      callback: Settings.config.callback,
      guild: guild,
      premium: premium,
      period: req.body.period,
    })
  })
  app.post("/paymentSuccess", async (req, res) => {
    res.redirect('/')
    const guildReport = client.guilds.cache.get('901445288881963059');
    const channelReport = guildReport.channels.cache.get('907178977758674984');
    const embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle(`Premium Payments`)
    .addField(`Guild Info`, `\`\`\`yml\nGuild Name: ${req.body.guildname} \nGuild ID: ${req.body.guildid}\`\`\``)
    .addField(`User Info:`, `\`\`\`yml\nUsername: ${req.user.username}#${req.user.discriminator} \nUser ID: ${req.user.id} \nEmail: ${req.user.email}\`\`\``)
    .addField(`Period`,`\`\`\`yml\n ${req.body.period}\`\`\``)
    .setTimestamp()

    // channelReport.send({
    //   embeds: [embed],
    //   // files: [file]
    // })
    for (const owner of config.ownerIDS) {
      client.users.fetch(owner).then(user => {
        user.send({
          embeds: [embed],
        }).catch(() => {});
      }).catch(() => {});
    }
  })
}