import { Schema, model } from "mongoose";

const schema = new Schema({
  guildId: String,
  msgId: String,
  threadId: String,
  reason: String,
  profile: String,
  requester: String,
});

const backupSchema = model("backup", schema);
export default backupSchema
