import { Schema, model } from "mongoose";

const reactionRolesSchema = new Schema({
    guildId: String,
    channelId: String,
    msgId: String,
    role1: String,
    role2: String,
    role3: String,
    role4: String,
});

const m = model("reactionrole", reactionRolesSchema);
export default m
