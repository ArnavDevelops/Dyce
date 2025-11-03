import { EmbedBuilder, TextChannel } from "discord.js";
import logSchema from "../../schemas/logSchema";
import { Event } from "../../structures/Event";

export default new Event("messageUpdate", async (oldMessage, newMessage) => {
  try {
    if (newMessage.content === oldMessage.content) return;
    if (newMessage.author.bot) return;

    const logData = await logSchema.findOne({ Guild: newMessage.guild.id });
    if (!logData) return;

    const logChannel = newMessage.guild.channels.cache.get(
      logData.Channel
    ) as TextChannel;
    if (!logChannel) return;

    let content =
      `**${newMessage.author.username}** (${newMessage.author.id}) updated their message in <#${newMessage.channelId}>\n` +
      `\n**Message:**\nhttps://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}\n` +
      `\n**Before:**\n${oldMessage.content || "No Message"}\n` +
      `\n**After:**\n${newMessage.content}\n`;

    if (newMessage.attachments.size > 0) {
      content += "\n**Attachment(s) attached with this Message:**\n";
      let attachmentNumber = 1;
      newMessage.attachments.forEach((attachment: any) => {
        content += `[Attachment #${attachmentNumber}](${attachment.url}) `;
        attachmentNumber++;
      });
    }

    const embed = new EmbedBuilder()
      .setColor("White")
      .setAuthor({
        name: `Message edited by ${newMessage.author.username}`,
        iconURL: `${newMessage.author.avatarURL()}`,
      })
      .setDescription(content)
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
