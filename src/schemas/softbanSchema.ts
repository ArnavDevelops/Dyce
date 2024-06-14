import { Schema, model } from "mongoose";

const softbanSchema = new Schema({
  guildId: String,
  userId: String,
  duration: String,
});

const m = model("softban", softbanSchema);
export default m