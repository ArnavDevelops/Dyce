import { EmbedBuilder } from "discord.js";
import AISchema from "../../schemas/AISchema"

//Message Create event
module.exports = {
  name: "messageCreate",
  async execute(message: any, client: any) {
    const { guild } = message;
    try {
      const data = await AISchema.findOne({ guildId: guild.id, enabled: true })
      if (data) {
        if (data.enabled = true) {
          if (message.mentions.has("1165391647845142548")) {
            async function aiReply(message: any, context = "") {
              const response = await fetch(
                `http://0.0.0.0:8000/generate/v2/?prompt=${encodeURIComponent(
                  message
                )}`
              );
              return await response.json();
            }

            const response = await aiReply(message.content);

            if (message.mentions.has("1165391647845142548")) {
              await message.reply(`${response.text}`);
            }
          }
        } else if (data.enabled == false) {
          if (message.mentions.has("1165391647845142548")) {
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription("***:warning: The AI feature is currently disabled in this server. Please try again after enabling it by using `/AI`***")
            await message.reply({ embeds: [embed] })
          }         
        }
      } else {
        if (message.mentions.has("1165391647845142548")) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("***:warning: The AI feature is currently disabled in this server. Please try again after enabling it by using `/AI`***")
          await message.reply({ embeds: [embed] })
        }
      }
    } catch (err: any) {
      return;
    }
  }
};