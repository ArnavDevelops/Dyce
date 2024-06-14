import { Schema, model } from "mongoose";

const joinRoleSchema = new Schema({
    guildId: String,
    roleId: String,
});

const m = model("role", joinRoleSchema);
export default m
