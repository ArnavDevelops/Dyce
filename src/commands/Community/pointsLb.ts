import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import pointsSchema from "../../schemas/pointsSchema";

  module.exports = {
    data: new SlashCommandBuilder()
      .setName("points-leaderboard")
      .setDescription("Check the list of users with points.")
      .setDMPermission(false),
    async execute(interaction: any, client: any) {
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
        components: [actionRow],
        ephemeral: true,
      });
    },
  };