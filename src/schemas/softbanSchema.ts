import { Schema, model } from "mongoose";

const schema = new Schema({
  guildId: String,
  userId: String,
  duration: String,
});

const softbanSchema = model("softban", schema);
export default softbanSchema