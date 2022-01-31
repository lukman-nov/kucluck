const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu
} = require("discord.js");
const ownerhelp = require("../../databases/ownerhelp");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  duration,
  handlemsg
} = require(`${process.cwd()}/handlers/functions`)
const url = require(`${process.cwd()}/botconfig/url.json`);
module.exports = {
  name: "ownerhelp",
  category: "Info",
  aliases: [],
  usage: "ownerhelp",
  description: "Returns all Commmands, or one specific command",
  type: "bot",
  cooldown: 0,
  owner: true,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let channel = message.mentions.channels.first();
    if (!channel) return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-music"]["var6"]))
      ]
    })

    let menuOptions = [
      {
        label: 'Information',
        value: 'Information',
        emoji: '🔰',
        description: 'Commands to share Information',
      },
      {
        label: 'Music',
        value: "Music",
        emoji: "🎶",
        description: "Commands to play Music / add Filter",
      },
      {
        label: 'Filter',
        value: "Filter",
        emoji: "👀",
        description: "Commands to add Filters to the Music",
      },
      {
        label: 'Premium',
        value: "Premium",
        emoji: "<:K_coin:916166348890079252>",
        description: "Commands to for Premium Server",
      },
      {
        label: 'Misc',
        value: "Misc",
        emoji: "⁉️",
        description: "Other commands",
      },
      {
        label: 'Fun',
        value: "Fun",
        emoji: "🎉",
        description: "Commands to for fun",
      },
      {
        label: 'Admin',
        value: "Admin",
        emoji: "🔑",
        description: "Commands to Admin",
      },
      {
        label: 'Settings',
        value: "Settings",
        emoji: "⚙️",
        description: "Commands to change Server Settings",
      }
    ];
    let menuSelection = new MessageSelectMenu()
    .setCustomId("MenuSelection")
    .setMinValues(1)
    .setMaxValues(5)
    .setPlaceholder("Click me to view Help-Menu-Category-Page(s)")
    .addOptions(menuOptions.filter(Boolean))
    let SelectionRow = new MessageActionRow().addComponents([menuSelection])
    const allbuttons = [SelectionRow]

    //define default embed
    let OverviewEmbed = new MessageEmbed()
      .setColor(es.color)
      .setThumbnail(es.thumb ? es.footericon : null)
      .setFooter(client.getFooter("Page Overview\n" + client.user.username, client.user.displayAvatarURL()))
      .setTitle(`Information about __${client.user.username}__`)
      .addField(`:muscle: **__All New Features__**`, `>>> :notes: An advanced ${emoji.msg.spotify} **Music System** with **Audio Filtering**:video_game: A unique Music Request System and way much more!`)
      .addField(`:question: **__How do you use me?__**`, `>>> \`${prefix}setup-music #text-channel\` To create the Music System, then connect to a **VC** and type your wished Song! but you can also do \`${prefix}play <SONGNAME/SONGLINK>\` without setting it up!\n or to play a playlist of songs you can use \`${prefix}playlist\``)
      .addFields({
        name: "🌐",
        value: `┕[[Dashboard]](${config.websiteSettings.domain})`,
        inline: true,
      }, {
        name: "🏠",
        value: `┕[[Support]](${config.websiteSettings.support})`,
        inline: true,
      }, {
        name: `<:K_logo:917295875619962880>`,
        value: `┕[[Invite]](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=identify%20email%20guilds%20bot%20applications.commands)`,
        inline: true,
      })
      
    let data = await ownerhelp.findOne({guild : message.guild.id });

    return channel.send({
      content: "To see all commands click the select menu.",
      embeds: [OverviewEmbed],
      components: allbuttons
    }).then(msg => {
      if (!data) {
        new ownerhelp({
          guild: message.guild.id,
          channel: channel.id,
          message: msg.id,
        }).save();
      }
    });
  }
}