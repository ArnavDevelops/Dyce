const { Schema, model } = require("mongoose");

const pointsSchema = new Schema({
  guildId: String,
  userId: String,
  points: { type: Number, required: true },
});

module.exports = model("points", pointsSchema);
