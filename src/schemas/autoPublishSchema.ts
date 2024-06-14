import { Schema, model } from "mongoose";

const autoPublishSchema = new Schema({
  guildId: String,
  channelId: String,
});

const m = model("autopublish", autoPublishSchema);
export default m

