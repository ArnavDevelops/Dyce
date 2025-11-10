import { Schema, model } from "mongoose";

const schema = new Schema({
  guildId: String,
  userId: String,
  moderatorId: String,
  reason: String,
  timestamp: Date,
});

const warnSchema = model("warning", schema);
export default warnSchema
