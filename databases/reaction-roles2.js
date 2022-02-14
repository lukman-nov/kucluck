const mongoose = require("mongoose");

const reactionRoleSchema2 = new mongoose.Schema({
  GuildId: String,
  Message: String,
  RolesId: Object,
});

module.exports = mongoose.model("reaction-roles2", reactionRoleSchema2);