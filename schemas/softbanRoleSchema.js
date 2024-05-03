const { Schema, model } = require("mongoose");

const softbanRoleSchema = new Schema({
  guildId: String,
  roleId: String,
});

module.exports = model("softbanRole", softbanRoleSchema);
