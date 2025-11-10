import { Schema, model } from "mongoose";

const schema = new Schema({
  guildId: String,
  moderatorId: String,
  command: String,
  date: Date,
  note: String,
});

const modNotesSchema = model("modNotes", schema);
export default modNotesSchema