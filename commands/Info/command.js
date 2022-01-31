const { MessageEmbed } = require("discord.js")
const config = require (`../../botconfig/config.json`)
module.exports = {
  name: "command",
  category: "Info",
  aliases: ["commandsinfo", "infocommands", "commands"],
  usage: "command",
  description: "Shows the all of Commands",
  type: "bot",
  cooldown: 0,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let categoryresult = client.categories.filter(name => name != 'Owner')
    let statsGlobal = await client.statsGlobal.findOne({ BotId: client.user.id });
    let statsGuild = await client.stats.findOne({ GuildId : message.guild.id });
    return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["info"]["command"]["var1"]))
        .setDescription(eval(client.la[ls]["cmds"]["info"]["command"]["var2"]))
        .setURL(`${config.websiteSettings.domain}commands`)
      ]
    })
  }
}