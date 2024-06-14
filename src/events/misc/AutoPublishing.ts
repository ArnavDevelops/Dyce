//Imports
import { ChannelType } from "discord.js";
import autoPublishSchema from "../../schemas/autoPublishSchema"

//Message Create event
module.exports = {
    name: "messageCreate",
    async execute(message: any) {
        const { guild, channel } = message;

        if (channel.type !== ChannelType.GuildAnnouncement) return;
        if (message.author.bot) return;
        if (message.content.startsWith(".")) {
            return;
        } else {
            const data = await autoPublishSchema.findOne({ guildId: guild.id, channelId: channel.id });
            if(data?.channelId == undefined && data?.channelId == null) return;

            if (!data) return;
            if (!data.channelId.includes(channel.id)) return;

            try {
                message.crosspost();
            } catch (err) {
                return;
            }
        }
    }
}