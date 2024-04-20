const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the bot's ping")
    .setDMPermission(false),
  async execute(interaction, client) {
    let circles = {
      good: "<:WiFi_Good:1123986555430780948>",
      okay: "<:WiFi_Okay:1123987177764835359>",
      bad: "<:WiFi_Bad:1123987088442929294>",
    };

    await interaction.deferReply();

    const pinging = await interaction.editReply({ content: "Pinging..." });

    const ws = interaction.client.ws.ping;
    const msgEdit = Date.now() - pinging.createdTimestamp;

    // uptime
    let days = Math.floor(interaction.client.uptime / 86400000);
    let hours = Math.floor(interaction.client.uptime / 3600000) % 24;
    let minutes = Math.floor(interaction.client.uptime / 60000) % 60;
    let seconds = Math.floor(interaction.client.uptime / 1000) % 60;

    const wsEmoji =
      ws <= 100 ? circles.good : ws <= 200 ? circles.okay : circles.bad;
    const msgEmoji = msgEdit <= 200 ? circles.good : circles.bad;

    const pingEmbed = new EmbedBuilder()
      .setThumbnail(interaction.client.user.displayAvatarURL({ size: 64 }))
      .setColor("Random")
      .setTimestamp()
      .setFooter({ text: "Pinged At" })
      .addFields(
        {
          name: "Websocket Latency",
          value: `${wsEmoji} \`${ws}ms\``,
        },
        {
          name: "API Latency",
          value: `${msgEmoji} \`${msgEdit}ms\``,
        },
        {
          name: `${interaction.client.user.username} Uptime`,
          value: `⏳ \`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds\``,
        }
      );

    await pinging.edit({ embeds: [pingEmbed], content: "\u200b" });
  },
};
