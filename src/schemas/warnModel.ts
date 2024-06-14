import { Schema, model } from "mongoose";

const warnModels = new Schema({
  guildId: String,
  userId: String,
  moderatorId: String,
  reason: String,
  timestamp: Date,
});

const m = model("warning", warnModels);
export default m
