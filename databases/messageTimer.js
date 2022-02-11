const mongo = require("mongoose");

const Schema = new mongo.Schema({
  GuildId: String,
  ChannelId: String,
  Timer: Number,
  Message: String,
  Status: Boolean,
});

module.exports = mongo.model("Message-Timer", Schema);