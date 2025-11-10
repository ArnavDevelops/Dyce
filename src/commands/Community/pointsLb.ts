import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  InteractionContextType,
} from "discord.js";
import pointsSchema from "../../schemas/pointsSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "points-leaderboard",
  description: "Who has the most or least points?",
  contexts: [InteractionContextType.Guild],
  run: async ({ interaction }) => {
    const { guild } = interaction;

    const page = 1;
    const usersPerPage = 10;
    const usersToSkip = (page - 1) * usersPerPage;

    const users = await pointsSchema
      .find({ points: { $gt: 0 }, guildId: guild.id })
      .sort({ points: -1 })
      .limit(usersPerPage)
      .skip(usersToSkip);

    let leaderboard = ``;
    let rank = usersToSkip + 1;

    if (users.length < 1) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:warning: No one in this server has points.***");
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    } else {
      for (const user of users) {
        if (user.points === 0) continue;
        leaderboard += `${rank}. **<@${user.userId}>** ● ${user.points}P\n`;
        rank++;
      }

      const previousButton = new ButtonBuilder()
        .setCustomId(`leaderboard:previous:${page}`)
        .setLabel("Previous")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === 1);

      const nextButton = new ButtonBuilder()
        .setCustomId(`leaderboard:next:${page}`)
        .setLabel("Next")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(users.length < usersPerPage);

      const actionRow = new ActionRowBuilder().addComponents(
        previousButton,
        nextButton
      );

      const embed = new EmbedBuilder()
        .setTitle("🪙 __Points Leaderboard__")
        .setDescription(leaderboard)
        .setColor("Random")
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.avatarURL(),
        });

      await interaction.reply({
        embeds: [embed],
        components: [actionRow.toJSON()],
        flags: "Ephemeral",
      });
    }
  },
});
