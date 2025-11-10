import { Schema, model } from "mongoose";

const schema = new Schema({
  guildId: String,
  roleId: String,
});

const eventRoleSchema = model("eventRole", schema);
export default eventRoleSchema
