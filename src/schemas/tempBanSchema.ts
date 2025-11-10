import { Schema, model } from "mongoose";

const schema = new Schema({
  guildId: String,
  userId: String,
  time: String,
});

const tempBanSchema = model("tempBan", schema);
export default tempBanSchema