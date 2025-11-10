import { EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "ping",
  description: "(does not) replies with pong",
  run: async ({ interaction }) => {
    let emojis = {
      good: "🟢🛜",
      okay: "🟡🛜",
      bad: "🔴🛜",
    };

    const pinging = await interaction.editReply({ content: "Pinging..." });
    const ws = interaction.client.ws.ping;
    const msgEdit = Date.now() - interaction.createdTimestamp;

    const wsEmoji =
      ws <= 100 ? emojis.good : ws <= 200 ? emojis.okay : emojis.bad;
    const msgEmoji = msgEdit <= 200 ? emojis.good : emojis.bad;

    const pingEmbed = new EmbedBuilder()
      .setThumbnail(interaction.client.user.displayAvatarURL({ size: 256 }))
      .setColor("White")
      .setTimestamp()
      .setFooter({ text: "Pinged At" })
      .addFields(
        {
          name: "API Latency",
          value: `${wsEmoji} \`${ws}ms\``,
        },
        {
          name: "Client Latency",
          value: `${msgEmoji} \`${msgEdit}ms\``,
        }
      );

    return await pinging.edit({ embeds: [pingEmbed], content: "\u200b" });
  },
});
