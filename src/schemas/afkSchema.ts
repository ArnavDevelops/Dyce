import { Schema, model } from "mongoose";

const afkSchema = new Schema({
  guildId: String,
  userId: String,
  reason: String,
  date: String,
  nickname: String,
});

const m = model("afkUser", afkSchema);
export default m

