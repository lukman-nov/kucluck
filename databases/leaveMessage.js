const mongo = require("mongoose");

const Schema = new mongo.Schema({
  GuildId: String,
  ChannelId: String,
  Message: String,
});

module.exports = mongo.model("leave-Message", Schema);
