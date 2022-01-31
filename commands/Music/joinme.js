const {
  MessageEmbed
} = require(`discord.js`);
const { delay } = require(`${process.cwd()}/handlers/functions`)
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const url = require(`${process.cwd()}/botconfig/url.json`);
module.exports = {
  name: `joinme`,
  category: `Music`,
  aliases: [],
  description: `Move the Bot in your Voice Channel`,
  usage: `leave`,
  parameters: {
    "type": "radio",
    "activeplayer": false,
    "check_dj": true,
    "previoussong": false
  },
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let ss = await client.Settings.findOne({ GuildId : message.guild.id })

    if (ss.DjRoles.length > 10) {
      if (!message.member.roles.cache.get(ss.DjRoles) && !message.member.permissions.has("ADMINISTRATOR")) {
        not_allowed = true;
        message.react("❌").catch(() => {})
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["common"]["not_DJ"]))
            .setDescription(`>>> **DJ - ROLE: **\n> <@&${ss.DjRoles}>`)
          ]
        }).then(msg => {
          setTimeout(() => {
            msg.delete().catch(() => {});
          }, 12000);
        });
      }
    }

    var { channel } = message.member.voice;
    var player = client.manager.players.get(message.guild.id);
    if (!channel) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.join_vc)
        ]
      });
    }
    if (player && channel == player.voiceChannel) {
      message.react(emoji.react.ERROR)
      return message.reply({
        embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["music"]["join"]["title2"]))
        ]
      }).then(msg => {
        setTimeout(() => {
          msg.delete().catch(() => {})
        }, 5000);
      })
    }
    if (player) {
      await player.destroy();
      let msg = await message.reply({
        embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setAuthor(client.getAuthor(eval(client.la[ls]["cmds"]["music"]["joinme"]["var1"]), url.img.loading))
        ]
      })
      try {
        await delay(2000);
        //create the player
        player = await client.manager.create({
          guild: message.guild.id,
          voiceChannel: message.member.voice.channel.id,
          textChannel: message.channel.id,
          selfDeafen: config.settings.selfDeaf,
        });
        //join the chanel
        if (player.state !== "CONNECTED") {
          await player.connect();
          await message.react("🎙").catch(e => {});
          await player.setVolume(ss.Volume)
          await player.stop();
          return msg.edit({
            embeds: [new MessageEmbed()
              .setColor(es.color)
              .setTitle(client.la[ls].cmds.music.join.title)
              .setDescription(eval(client.la[ls]["cmds"]["music"]["join"]["variable2"]))
            ]
          }).catch((e) => {console.log(e.stack)});
        }
      } catch (e) {
        console.log(e.stack)
      }
    } else {
      message.react(emoji.react.ERROR)
      return message.reply({
        embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(eval(client.la[ls]["cmds"]["music"]["joinme"]["var2"]))
        ]
      })
    }
  }
};