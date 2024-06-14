import { Schema, model } from "mongoose";

const pointsSchema = new Schema({
  guildId: String,
  userId: String,
  points: { type: Number, required: true },
});

const m = model("points", pointsSchema);
export default m
