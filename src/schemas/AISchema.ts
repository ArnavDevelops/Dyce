import { Schema, model } from "mongoose";

const afkSchema = new Schema({
  guildId: String,
  enabled: Boolean,
});

const m = model("AI", afkSchema);
export default m

