import { Schema, model } from "mongoose";

const schema = new Schema({
  Guild: String,
  Channel: String,
});

const logSchema = model("Logging", schema);
export default logSchema