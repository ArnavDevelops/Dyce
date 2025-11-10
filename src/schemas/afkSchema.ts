import { Schema, model } from "mongoose";

const schema = new Schema({
  guildId: String,
  userId: String,
  reason: String,
  date: String,
  nickname: String,
});

const afkSchema = model("afkUser", schema);
export default afkSchema

