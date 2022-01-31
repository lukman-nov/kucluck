const mongoose = require("mongoose");

const ownerhelp = new mongoose.Schema({
  guild: String,
  channel: String,
  message: String,
});

module.exports = mongoose.model("owner-help", ownerhelp);
