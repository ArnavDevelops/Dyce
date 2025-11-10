import { Schema, model } from "mongoose";

const schema = new Schema({
  guildId: String,
  channelId: String,
});

const autoPublishSchema = model("autopublish", schema);
export default autoPublishSchema

