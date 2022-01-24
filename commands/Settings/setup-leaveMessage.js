const {
  MessageEmbed
} = require("discord.js");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const ee = require('../../botconfig/embed')
const url = require('../../botconfig/url.json')

module.exports = {
  name: "setup-leavemessage",
  category: `Settings`,
  aliases: ["leavemessage", "leavemsg"],
  cooldown: 10,
  usage: "setup-leavemessage <#text-channel> <messages>",
  description: "Setting your leave message in your server",
  memberpermissions: ["ADMINISTRATOR"],
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    const channel = message.mentions.channels.first();
    const msg = args.slice(1).join(' ')

    if (!channel) {
      return message.reply({
        embeds: [
          new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setThumbnail(es.thumb ? url.img.ERROR : null)
          .setTitle(`${emoji.msg.ERROR} Please mentions a text channel and type a message.`)
          .addField(`Usage: `, `${prefix}setup-leavemessage <#text-channel> <messages>`)
          .addField(`Format Message: `, `\`%mention% = Mention Member\n%guild% = Guild Name\n**% %** = Bold font\``)
          .addField(`Example: `, `\`\`\`cc\n${prefix}setup-leavemessage #leave-channel Goodbye %mention% from **%guild%** \`\`\``)
        ],
      })
    }
    if (!msg) {
      return message.reply({
        embeds: [
          new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setThumbnail(es.thumb ? url.img.ERROR : null)
          .setTitle(`${emoji.msg.ERROR} Please mentions a text channel and type a message.`)
          .addField(`Usage: `, `${prefix}setup-leavemessage <#text-channel> <messages>`)
          .addField(`Format Message: `, `\`%mention% = Mention Member\n%guild% = Guild Name\n**% %** = Bold font\``)
          .addField(`Example: `, `\`\`\`cc\n${prefix}setup-leavemessage #leave-channel Goodbye %mention% from **%guild%** \`\`\``)
        ],
      })
    }
    const ss = await client.Settings.findOne({
      GuildId: message.guild.id
    });
    client.leaveMessage.findOne({
      GuildId: message.guild.id
    }, async (err, data) => {
      if (data) {
        data.ChannelId = channel.id;
        data.Message = msg;
        if (!ss.leaveMessage) {
          ss.leaveMessage = true;
        } else ss.leaveMessage = true;
        await data.save();
        await ss.save();
        message.react(emoji.react.SUCCESS).catch(() => {});
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.color)
            .setTitle(`${emoji.msg.SUCCESS} Succesfully created Leave Message!`)
            .setDescription(`>>> **Channel: ** <#${channel.id}> \n **Message: ** ${msg}`)
          ]
        })
      }
    });
  }
};