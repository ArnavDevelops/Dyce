import { Schema, model } from "mongoose";

const schema = new Schema({
  guildId: String,
  roleId: String,
});

const softbanRoleSchema = model("softbanRole", schema);
export default softbanRoleSchema
