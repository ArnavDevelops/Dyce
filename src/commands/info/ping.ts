//Imports
import { EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "ping",
  description: "replies with pong",
  run: async ({ interaction }) => {
    //Misc
    let circles = {
      good: "<:WiFi_Online:1231374139621900362>",
      okay: "<:WiFi_PerformanceIssues:1231374366164647986>",
      bad: "<:WiFi_Offline:1231374258794397788>",
    };

    await interaction.deferReply();

    const pinging = await interaction.editReply({ content: "Pinging..." });
    const ws = interaction.client.ws.ping;
    const msgEdit = Date.now() - interaction.createdTimestamp;

    //Emoji
    const wsEmoji =
      ws <= 100 ? circles.good : ws <= 200 ? circles.okay : circles.bad;
    const msgEmoji = msgEdit <= 200 ? circles.good : circles.bad;

    //Embed
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
