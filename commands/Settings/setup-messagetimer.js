var {
  MessageEmbed,
  MessageButton,
  MessageActionRow
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  duration,
  databasing
} = require('../../handlers/functions');

module.exports = {
  name: "setup-messagetimer",
  category: `Settings`,
  aliases: ["messagetimer"],
  cooldown: 0,
  usage: "setup-messagetimer",
  description: "Setup a Message Timer",
  memberpermissions: ["ADMINISTRATOR"],
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let data = await client.messageTimer.findOne({
      GuildId: message.guild.id
    });
    let btnSetup = new MessageButton().setStyle('SUCCESS').setCustomId('setup').setEmoji("⚙️").setLabel("Setup")
    let btnReset = new MessageButton().setStyle('DANGER').setCustomId('reset').setEmoji("🗑").setLabel("Reset")
    let btnCancel = new MessageButton().setStyle('SECONDARY').setCustomId('cancel').setEmoji("❌").setLabel("Cancel")

    if (data.ChannelId == "") {
      btnReset = btnReset.setDisabled(true);
    }

    let allComponent = [
      new MessageActionRow().addComponents([
        btnSetup,
        btnReset,
        btnCancel,
      ]),
    ]
    let fristMsg = await message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle('What do you want to do?')
      ],
      components: allComponent,
    })
    const collector = fristMsg.createMessageComponentCollector({
      filter: i => i.isButton() && i.message.author.id == client.user.id && i.user,
      time: 60000,
      errors: ['time']
    })
    collector.on('collect', async i => {
      try {
        if (i.isButton()) {
          if (i.user.id !== message.author.id) return i.reply({
            content: `${emoji.msg.ERROR} Your not allowed!`,
            ephemeral: true
          });
          if (i.customId == "setup") {
            let tempmsg = await message.channel.send({
              embeds: [new MessageEmbed()
                .setColor(es.color)
                .setTitle(`Please Mention a Channel`)
              ]
            })
            await tempmsg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async (collected) => {
                var channel = collected.first().content;
                let str = channel;
                let newStr = str.replace('<#', '');
                let channelid = newStr.replace('>', '');
                const validChannel = message.guild.channels.cache.get(channelid)
                if (!validChannel) return message.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(`${emoji.msg.ERROR} Please mention a __Valid Channel!__`)
                  ]
                });
                data.ChannelId = channelid;
                data.save();
                await tempmsg.edit({
                  embeds: [new MessageEmbed()
                    .setTitle(`${emoji.msg.SUCCESS} Channel has been set!`)
                    .setDescription(`**Now Please Enter a __Timer__**\nThe timer must be hours \`min 1 max 24\`\n\n> *Example:* \n\`4 = 4 hours\n12 = 12 hours\``)
                    .setColor(es.color)
                  ]
                })
                await tempmsg.channel.awaitMessages({
                    filter: m => m.author.id === message.author.id,
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                  .then(async (collected) => {
                    var timer = collected.first().content;
                    let milis = timer * 3600000;
                    if (!parseInt(timer)) return message.reply({
                      embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setTitle(`${emoji.msg.ERROR} Please enter a __Valid Timer!__`)
                        .setDescription(`The timer must be hours \`min 1 max 24\`\n> *Example:* \n\`4 = 4 hours\n12 = 12 hours\``)
                      ]
                    });
                    if (timer.length > 2 || milis > 86400000) return message.reply({
                      embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setTitle(`${emoji.msg.ERROR} Please enter a __Valid Timer!__`)
                        .setDescription(`The timer must be hours \`min 1 max 24\`\n> *Example:* \n\`4 = 4 hours\n12 = 12 hours\``)
                      ]
                    });
                    data.Timer = milis;
                    data.save();
                    await tempmsg.edit({
                      embeds: [new MessageEmbed()
                        .setTitle(`${emoji.msg.SUCCESS} Timer has been set to \`${duration(milis, false)}\``)
                        .setDescription(`**Now Please Enter a __Messages__**\nMax 2000 character`)
                        .setColor(es.color)
                      ]
                    });
                    await tempmsg.channel.awaitMessages({
                        filter: m => m.author.id === message.author.id,
                        max: 1,
                        time: 180000,
                        errors: ["time"]
                      })
                      .then(async (collected) => {
                        var msg = collected.first().content;
                        if (!msg && msg.length > 2000) return message.reply({
                          embeds: [new MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setTitle(`${emoji.msg.ERROR} Please enter a __Valid Messages!__`)
                            .setDescription(`**Max 2000 character**`)
                          ]
                        });
                        data.Message = msg;
                        data.Status = true;
                        data.save();
                        await tempmsg.edit({
                          embeds: [new MessageEmbed()
                            .setTitle(`${emoji.msg.SUCCESS} Message has been set!`)
                            .setDescription(`**Now I will send this message once every \`${duration(data.Timer, false)}\`**`)
                            .setColor(es.color)
                          ]
                        });
                      })
                      .catch(e => {
                        timeouterror = e;
                      });
                  })
                  .catch(e => {
                    timeouterror = e;
                  });
              }).catch(e => {
                timeouterror = e;
              });
          }
          if (i.customId == "reset") {
            await client.messageTimer.findOneAndDelete({
              GuildId: message.guild.id
            });
            databasing(client, message.guild.id, message.author.id)
            return fristMsg.edit({
              embeds: [new MessageEmbed()
                .setColor(es.color)
                .setTitle(`${emoji.msg.SUCCESS} Message Timer has been Reset!`)
              ],
              components: []
            })
          }
          if (i.customId == "cancel") {
            return fristMsg.edit({
              embeds: [new MessageEmbed()
                .setColor(es.color)
                .setTitle(`${emoji.msg.ERROR} Cancel the Operation`)
              ],
              components: []
            })
          }
        }
      } catch (e) {
        console.log(e.stack ? String(e.stack).grey : String(e).grey)
      }
    })
    collector.on('end', collected => {
      fristMsg.edit({
        embeds: [fristMsg.embeds[0].setTitle(`~~${fristMsg.embeds[0].title}~~`)],
        components: [],
        content: `${collected && collected.first() && collected.first().customId ? `${emoji.msg.SUCCESS} **Selected the \`${collected.first().customId}\`. Button**` : "❌ **NOTHING SELECTED - CANCELLED**" }`
      })
    });
  },
};