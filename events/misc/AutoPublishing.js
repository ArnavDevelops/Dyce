//Imports
const { ChannelType, Events } = require("discord.js");
const autoPublishSchema = require("../../schemas/autoPublishSchema.js");

//Message Create event
module.exports = {
    name: "messageCreate",
    async execute(message) {
        const { guild, channel } = message;

        if (channel.type !== ChannelType.GuildAnnouncement) return;
        if (message.author.bot) return;
        if (message.content.startsWith(".")) {
            return;
        } else {
            const data = await autoPublishSchema.findOne({ guildId: guild.id });

            if (!data) return;
            if (!data.channelId.includes(channel.id)) return;

            try {
                message.crosspost();
            } catch (err) {
                console.log(err);
            }
        }
    }
}