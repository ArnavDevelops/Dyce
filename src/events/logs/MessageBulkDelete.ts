import { EmbedBuilder } from "discord.js";
import logSchema from "../../schemas/logSchema"

module.exports = {
  name: "messageDeleteBulk",
  async execute(messages: any, client: any) {
    try {
      const logData = await logSchema.findOne({ Guild: client.guild.id });
      if (!logData) return;

      const logChannel = client.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      const channel = messages.first()?.channel;

      const embed1 = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`${messages.size} messages deleted in #${channel.name}`)
        .setDescription(
          `**Channel:**\n ${channel}\n
          **Count:**\n ${messages.size}`
        )
        .setFooter({
          text: "Dyce#3312",
          iconURL: "https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&",
        })
        .setTimestamp();

      await logChannel.send({ embeds: [embed1] });
    } catch (err) {
      return;
    }
  },
};
