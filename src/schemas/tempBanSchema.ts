import { Schema, model } from "mongoose";

const tempBanSchema = new Schema({
  guildId: String,
  userId: String,
  time: String,
});

const m = model("tempBan", tempBanSchema);
export default m