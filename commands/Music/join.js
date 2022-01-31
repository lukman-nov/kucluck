const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const config = require(`${process.cwd()}/botconfig/config.json`);
module.exports = {
  name: `join`,
  category: `Music`,
  aliases: [`summon`, `create`],
  description: `Summons the Bot in your Channel`,
  usage: `leave`,
  parameters: {
    "type": "radio",
    "activeplayer": false,
    "check_dj": false,
    "previoussong": false
  },
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    var { channel } = message.member.voice;
    if (!channel)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.join_vc)
        ]
      });
      
    var player = client.manager.players.get(message.guild.id);
    if (player) { 
      var vc = player.voiceChannel; 
      var voiceChannel = message.guild.channels.cache.get(player.voiceChannel);
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["join"]["title2"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["join"]["variable1"]))
        ]
      });
    }
    let ss = await client.Settings.findOne({ GuildId : message.guild.id })
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
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setTitle(client.la[ls].cmds.music.join.title)
          .setDescription(eval(client.la[ls]["cmds"]["music"]["join"]["variable2"]))
        ]
      });
    } else {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["join"]["title2"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["join"]["variable3"]))
        ]
      });
    }
  }
};