const Discord = require('discord.js')
const {
  MessageEmbed
} = require('discord.js')
const emoji = require('../../botconfig/emojis.json');
const NSFW = require('discord-nsfw')
const nsfw = new NSFW();
module.exports = {
  name: "hentai",
  aliases: [],
  category: "Nsfw",
  description: "nsfw cmd.",
  usage: "hentai",
  type: "bot",
  cooldown: 5,
  async run(client, message, args, cmduser, text, prefix, es, ls) {
    let tempmsg = await message.channel.send({
      embeds: [new MessageEmbed()
        .setAuthor(client.getAuthor(`Loading...`, `https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif`))
        .setColor(es.color)
      ]
    })
    try {
      if (message.channel.nsfw) {
        const image = await nsfw.hentai();
        tempmsg.edit({
          embeds: [new Discord.MessageEmbed()
            .setTitle(`Hentai Image`)
            .setColor("BLACK")
            .setImage(image)
          ]
        })
        return message.react(emoji.msg.SUCCESS)
      } else {
        message.react(emoji.msg.ERROR)
        return tempmsg.edit({
          embeds: [new Discord.MessageEmbed()
            .setTitle(`${emoji.msg.ERROR} NSFW Not Allowed Here!`)
            .setDescription(`Use **NSFW** Commands In A **NSFW** Marked Channel ( Look In Channel Settings, Dummy )`)
            .setImage("https://i.imgur.com/oe4iK5i.gif")
            .setColor("RANDOM")
          ]
        });
      }
    } catch (e) {
      message.react(emoji.react.ERROR)
      tempmsg.delete();
      return message.reply(`${emoji.msg.ERROR} **An error occurred**\n\`\`\`yml\n${e.message ? e.message : String(e).grey.substr(0, 2000)}\`\`\``).catch((e) => {})
    }
  }
}