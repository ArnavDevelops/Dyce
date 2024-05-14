const { Schema, model } = require("mongoose");

const joinRoleSchema = new Schema({
    guildId: String,
    roleId: String,
});

module.exports = model("role", joinRoleSchema);
