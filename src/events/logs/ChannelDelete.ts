import {
  EmbedBuilder,
  NonThreadGuildBasedChannel,
  TextChannel,
} from "discord.js";
import logSchema from "../../schemas/logSchema";
import { Event } from "../../structures/Event";

export default new Event(
  "channelDelete",
  async (channel: NonThreadGuildBasedChannel) => {
    try {
      const logData = await logSchema.findOne({ Guild: channel.guild.id });
      if (!logData) return;

      const logChannel = channel.guild.channels.cache.get(
        logData.Channel
      ) as TextChannel;
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Channel Deleted")
        .setDescription(
          `**Name:**\n ${channel.name} (${channel.id})\n
        **Type:**\n ${getChannelTypeName(channel.type)}`
        )
        .setFooter({
          text: "Dyce#3312",
          iconURL:
            "https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&",
        })
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });

      function getChannelTypeName(channelType: any) {
        const channelTypeMapping = {
          0: "Text",
          1: "DM",
          2: "Voice",
          3: "Group DM",
          4: "Category",
          5: "Announcement",
          10: "News Thread",
          11: "Public Thread",
          12: "Private Thread",
          13: "Stage Voice",
          14: "Directory",
          15: "Forum",
          16: "Media",
        } as any;

        return channelTypeMapping[channelType] || "Unknown";
      }
    } catch (err) {
      return;
    }
  }
);
