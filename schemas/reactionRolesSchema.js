const { Schema, model } = require("mongoose");

const reactionRolesSchema = new Schema({
    guildId: String,
    channelId: String,
    role1: String,
    role2: String,
    role3: String,
    role4: String,
});

module.exports = model("reactionrole", reactionRolesSchema);
