import { Schema, model } from "mongoose";

const modNotesSchema = new Schema({
  guildId: String,
  moderatorId: String,
  command: String,
  date: Date,
  note: String,
});

const m = model("modNotes", modNotesSchema);
export default m