import { Schema, model } from "mongoose";

const schema = new Schema({
    guildId: String,
    roleId: String,
});

const joinRoleSchema = model("joinRole", schema);
export default joinRoleSchema
