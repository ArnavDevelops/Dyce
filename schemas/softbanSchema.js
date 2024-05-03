const { Schema, model } = require("mongoose");

const softbanSchema = new Schema({
  guildId: String,
  userId: String,
  duration: String,
});

module.exports = model("softban", softbanSchema);