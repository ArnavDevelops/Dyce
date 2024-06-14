import { Schema, model } from "mongoose";

const backupSchema = new Schema({
  guildId: String,
  msgId: String,
  threadId: String,
  reason: String,
  profile: String,
  requester: String,
});

const m = model("backup", backupSchema);
export default m
