const { Schema, model } = require("mongoose");

const autoPublishSchema = new Schema({
  guildId: String,
  channelId: String,
});

module.exports = model("autopublish", autoPublishSchema);
