const { Schema, model } = require("mongoose");

const backupSchema = new Schema({
  guildId: String,
  msgId: String,
  threadId: String,
  reason: String,
  profile: String,
  requester: String,
});

module.exports = model("backup", backupSchema);
