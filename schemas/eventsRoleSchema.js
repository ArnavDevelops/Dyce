const { Schema, model } = require("mongoose");

const eventRoleSchema = new Schema({
  guildId: String,
  roleId: String,
});

module.exports = model("eventRole", eventRoleSchema);
