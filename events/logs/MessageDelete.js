const { EmbedBuilder } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  name: "messageDelete",
  async execute(message) {
    try {
      if (message.author.bot) return;

      const logData = await logSchema.findOne({ Guild: message.guild.id });
      if (!logData) return;

      const logChannel = message.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      let content = `**${message.author.username}** (${message.author.id}) deleted their message in #${message.channel.name}\n` +
      `\n**Channel**\n<#${message.channel.id}>\n` +
      `\n**Message:**\n${message.content || "No Message"}\n`;

      if (message.attachments.size > 0) {
        content += "\n**Attachment(s) attached with this Message:**\n";
        let attachmentNumber = 1;
        message.attachments.forEach(attachment => {
            content += `[Attachment #${attachmentNumber}](${attachment.url}) `;
            attachmentNumber++;
        });
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
          iconURL: "https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&",
        })
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (err) {
      return;
    }
  },
};
