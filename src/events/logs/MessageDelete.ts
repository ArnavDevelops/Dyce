import {
  EmbedBuilder,
  MessageType,
  PartialMessage,
  TextChannel,
} from "discord.js";
import logSchema from "../../schemas/logSchema";
import { Event } from "../../structures/Event";

export default new Event("messageDelete", async (message) => {
  try {
    if (message.author?.bot) return;

    const logData = await logSchema.findOne({ Guild: message.guild.id });
    if (!logData) return;

    const logChannel = message.guild.channels.cache.get(
      logData.Channel
    ) as TextChannel;
    if (!logChannel) return;

    let content: string;

    if (message.type !== MessageType.Reply) {
      content =
        `**${message.author.username}** (${
          message.author.id
        }) deleted a message in #${(message.channel as TextChannel).name}\n` +
        `\n**Channel**\n<#${message.channel.id}>\n` +
        `\n**Message:**\n${message.content || "No Message"} \n`;
    } else {
      const referencedMsg = await message.fetchReference();

      content =
        `**${message.author.username}** (${
          message.author.id
        }) deleted a message in #${(message.channel as TextChannel).name}\n` +
        `\n**Channel**\n<#${message.channel.id}>\n` +
        `\n**Replying to**\n<@${referencedMsg.author.id}>\n` +
        `\n**Message:**\n${message.content || "No Message"} \n`;
    }

    if (message.attachments.size > 0) {
      content += "\n**Attachment(s) attached with this Message:**\n";
      let attachmentNumber = 1;
      message.attachments.forEach((attachment: any) => {
        content += `[Attachment #${attachmentNumber}](${attachment.url}) `;
        attachmentNumber++;
      });
    }

    if (message.poll) {
      content += `\n**Poll with question "${
        message.poll.question.text
      }" was deleted in <#${
        message.channel.id
      }>:**\n> Poll result date: <t:${Math.floor(
        message.poll.expiresAt.getTime() / 1000
      )}> | <t:${Math.floor(
        message.poll.expiresAt.getTime() / 1000
      )}:R>\n> Poll started by: **${message.author.username}** (${
        message.author.id
      })`;
    }
    if (message.stickers.size == 1) {
      const s = message.stickers.first();
      content += `\n**Sticker**\n[Sticker](${s.url})`;
    }

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({
        name: `Message deleted by ${message.author.username}`,
        iconURL: `${message.author.avatarURL()}`,
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
    console.log(err);
  }
});
