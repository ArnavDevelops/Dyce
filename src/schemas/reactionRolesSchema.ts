import { Schema, model } from "mongoose";

const schema = new Schema({
    guildId: String,
    channelId: String,
    msgId: String,
    role1: String,
    role2: String,
    role3: String,
    role4: String,
});

const ReactionRolesSchema = model("reactionrole", schema);
export default ReactionRolesSchema
