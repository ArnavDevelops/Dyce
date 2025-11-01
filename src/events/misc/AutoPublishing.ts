//Imports
import { ChannelType } from "discord.js";
import autoPublishSchema from "../../schemas/autoPublishSchema";
import { Event } from "../../structures/Event";

//Message Create event
export default new Event("messageCreate", async (message) => {
  const { guild, channel } = message;

  if (channel.type !== ChannelType.GuildAnnouncement) return;
  if (message.author.bot) return;
  if (message.content.startsWith(".")) {
    return;
  } else {
    const data = await autoPublishSchema.findOne({
      guildId: guild.id,
      channelId: channel.id,
    });
    if (data?.channelId == undefined && data?.channelId == null) return;

    if (!data) return;
    if (!data.channelId.includes(channel.id)) return;

    try {
      message.crosspost();
    } catch (err) {
      return;
    }
  }
});
