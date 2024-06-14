import { Schema, model } from "mongoose";

const guildSchema = new Schema({
  Guild: String,
  Channel: String,
});

const m = model("Guild", guildSchema);
export default m