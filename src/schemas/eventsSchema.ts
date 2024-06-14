import { Schema, model } from "mongoose";

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

const m = model("event", eventSchema);
export default m
