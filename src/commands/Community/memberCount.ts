import { EmbedBuilder, InteractionContextType } from "discord.js";
import QuickChart from "quickchart-js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "membercount",
  description: "Counting the members in the server",
  contexts: [InteractionContextType.Guild],
  run: async ({ interaction }) => {

    const { guild } = interaction;
    const totalMembers = guild.memberCount;
    const botMembers = guild.members.cache.filter(
      (member: any) => member.user.bot
    ).size;
    const humanMembers = totalMembers - botMembers;
    const last24Hours = guild.members.cache.filter(
      (member: any) => Date.now() - member.joinedTimestamp < 24 * 60 * 60 * 1000
    ).size;
    const last7Days = guild.members.cache.filter(
      (member: any) =>
        Date.now() - member.joinedTimestamp < 7 * 24 * 60 * 60 * 1000
    ).size;

    interaction.deferReply();

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
        .setThumbnail(guild.iconURL())
        .setColor("Random")
        .setDescription(
          `**Total:** ${totalMembers}\n**Members:** ${humanMembers}\n**Bots:** ${botMembers}\n**Growth in last 24h:** ${last24Hours}\n**Growth in last 7 days:** ${last7Days}`
        )
        .setImage(chartUrl);
      return await interaction.followUp({ embeds: [embed] });
    } catch (err) {
      return;
    }
  },
});
