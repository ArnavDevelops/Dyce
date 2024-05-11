const { Schema, model } = require("mongoose");

const modNotesSchema = new Schema({
  guildId: String,
  moderatorId: String,
  command: String,
  date: Date,
  note: String,
});

module.exports = model("modNotes", modNotesSchema);