import { EmbedBuilder, TextChannel } from "discord.js";
import logSchema from "../../schemas/logSchema";
import { Event } from "../../structures/Event";

export default new Event("stickerUpdate", async (oldSticker, newSticker) => {
  try {
    const logData = await logSchema.findOne({ Guild: newSticker.guild.id });
    if (!logData) return;

    const logChannel = newSticker.guild.channels.cache.get(
      logData.Channel
    ) as TextChannel;
    if (!logChannel) return;

    const changedProperties = [];

    if (oldSticker.name !== newSticker.name) {
      changedProperties.push(
        `\n**Name:**\n ${oldSticker.name} ⮕ ${newSticker.name}`
      );
    }

    if (oldSticker.description !== newSticker.description) {
      changedProperties.push(
        `\n**Description:**\n ${oldSticker.description || "None"} ⮕ ${
          newSticker.description || "None"
        }`
      );
    }

    if (oldSticker.tags !== newSticker.tags) {
      changedProperties.push(
        `\n**Emoji**\n :${oldSticker.tags}: ⮕ :${newSticker.tags}:`
      );
    }

    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Sticker Updated")
      .setDescription(
        `**Sticker:**\n ${newSticker.name} (${
          newSticker.id
        })\n${changedProperties.join(`\n`)}`
      )
      .setThumbnail(newSticker.url)
      .setFooter({
        text: "Dyce#3312",
        iconURL:
          "https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&",
      })
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  } catch (err) {
    return;
  }
});
