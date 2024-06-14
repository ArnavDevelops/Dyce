import { Schema, model } from "mongoose";

const eventRoleSchema = new Schema({
  guildId: String,
  roleId: String,
});

const m = model("eventRole", eventRoleSchema);
export default m
