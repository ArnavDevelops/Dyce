const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const QuickChart = require("quickchart-js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Shows the amount of members in the server.")
    .setDMPermission(false),
  async execute(interaction, client) {
    const { guild } = interaction;
    const totalMembers = guild.memberCount;
    const botMembers = guild.members.cache.filter(
      (member) => member.user.bot
    ).size;
    const humanMembers = totalMembers - botMembers;
    const last24Hours = guild.members.cache.filter(
      (member) => Date.now() - member.joinedTimestamp < 24 * 60 * 60 * 1000
    ).size;
    const last7Days = guild.members.cache.filter(
      (member) => Date.now() - member.joinedTimestamp < 7 * 24 * 60 * 60 * 1000
    ).size;

    interaction.deferReply()

    try {
      const chart = new QuickChart();
      chart
        .setConfig({
          type: "bar",
          data: {
            labels: ["Total", "Members", "Bots", "24h", "7 days"],
            datasets: [
              {
                label: "Member Count",
                data: [
                  totalMembers,
                  humanMembers,
                  botMembers,
                  last24Hours,
                  last7Days,
                ],
                backgroundColor: [
                  "#36a2eb",
                  "#ffce56",
                  "#ff6384",
                  "#cc65fe",
                  "#66ff99",
                ],
              },
            ],
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: `Server name: ${guild.name}`,
              },
            },
          },
        })
        .setWidth(500)
        .setHeight(300)
        .setBackgroundColor("#151515");
      const chartUrl = await chart.getShortUrl();

      const embed = new EmbedBuilder()
        .setTitle(`Member count of ${guild.name}`)
        .setColor("Random")
        .setDescription(
          `**Total:** ${totalMembers}\n**Members:** ${humanMembers}\n**Bots:** ${botMembers}\n**Growth in last 24h:** ${last24Hours}\n**Growth in last 7 days:** ${last7Days}`
        )
        .setImage(chartUrl);
      await interaction.followUp({ embeds: [embed] });
    } catch (err) {
      console.error(err)
    }
  },
};
