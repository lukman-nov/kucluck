const {
  MessageEmbed,
} = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `leaveplayer`,
  type: "info",
  category: "Owner",
  aliases: [`deployslash`, "deploy", "loadslash", "deployslashcommands", "deployslashcmds", "loadslashcommands", "loadslashcmds"],
  description: `Deploy and Enable the Slash Commands of this Bot! Either GLOBALLY or for ONE GUILD ONLY`,
  usage: `deployslash [GUILDID]`,
  cooldown: 10,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    if (!config.ownerIDS.some(r => r.includes(message.author.id)))
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable2"]))
        ]
      });
    player.destroy();
  },
};