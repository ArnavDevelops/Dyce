const { Schema, model } = require("mongoose");

const pollSchema = new Schema({
  count: { type: Number, required: true },
});

module.exports = model("poll", pollSchema);
