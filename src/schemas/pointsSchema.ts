import { Schema, model } from "mongoose";

const schema = new Schema({
  guildId: String,
  userId: String,
  points: { type: Number, required: true },
});

const pointsSchema = model("points", schema);
export default pointsSchema
