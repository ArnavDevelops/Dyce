const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
  guildId: String,
  msgId: String,
  threadId: String,
  title: String,
  description: String,
  joiningList: [],
  notJoiningList: [],
  neutralList: [],
  startTime: String,
  endTime: String,
  timeItStarts: Date, 
});

module.exports = model("event", eventSchema);
