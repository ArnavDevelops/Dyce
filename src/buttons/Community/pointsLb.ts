import { Button } from "../../structures/Button";
import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import pointsSchema from "../../schemas/pointsSchema";

export default new Button("leaderboard:", async ({ interaction }) => {
  const { customId } = interaction;

  let page: any;
  if (customId.startsWith("leaderboard:next:"))
    page = parseInt(customId.split(`:`)[2]) + 1;
  else if (customId.startsWith(`leaderboard:previous:`))
    page = parseInt(customId.split(`:`)[2]) - 1;

  const usersPerPage = 10;
  const usersToSkip = (page - 1) * usersPerPage;
  const users = await pointsSchema
    .find()
    .sort({ points: -1 })
    .skip(usersToSkip)
    .limit(usersPerPage);

  let leaderboard = ``;
  let rank = usersToSkip + 1;

  for (const user of users) {
    if (user.points == 0) continue;
    leaderboard += `${rank}. **<@${user.userId}>** ● ${user.points}P\n`;
    rank++;
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`leaderboard:previous:${page}`)
      .setLabel(`Previous`)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId(`leaderboard:next:${page}`)
      .setLabel(`Next`)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(users.length < usersPerPage)
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

  await interaction.update({
    embeds: [embed],
    components: [row.toJSON()],
  });
});
