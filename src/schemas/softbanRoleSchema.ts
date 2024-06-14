import { Schema, model } from "mongoose";

const softbanRoleSchema = new Schema({
  guildId: String,
  roleId: String,
});

const m = model("softbanRole", softbanRoleSchema);
export default m
