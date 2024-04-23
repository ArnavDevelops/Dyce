const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the bot's ping")
    .setDMPermission(false),
  async execute(interaction, client) {
    let circles = {
      good: "<:WiFi_Online:1231374139621900362>",
      okay: "<:WiFi_PerformanceIssues:1231374366164647986>",
      bad: "<:WiFi_Offline:1231374258794397788>",
    };

    await interaction.deferReply();

    if (interaction.user.id !== "947568482407546991") {
      const permissionEmbed = new EmbedBuilder()
        .setDescription(
          "***:warning: Only the owner of Dyce can run this command.***"
        )
        .setColor(`Red`);
      await interaction.followUp({
        embeds: [permissionEmbed],
        ephemeral: true,
      });
    }
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
