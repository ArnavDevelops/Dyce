const { Schema, model } = require("mongoose");

const warnModels = new Schema({
  guildId: String,
  userId: String,
  moderatorId: String,
  reason: String,
  timestamp: Date,
});

module.exports = model("warning", warnModels);
