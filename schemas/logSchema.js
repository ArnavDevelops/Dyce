const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
  Guild: String,
  Channel: String,
});

module.exports = model("Guild", guildSchema);
