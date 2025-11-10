import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  InteractionContextType,
} from "discord.js";
import pointsSchema from "../../schemas/pointsSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "points-info",
  description: "Information about the user",
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "user",
      description: "Select the user or leave it to see your own",
      type: ApplicationCommandOptionType.User,
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;
    try {
      const e = args.getUser("user") || interaction.user;
      const user = await guild.members.fetch(e).catch(async (err: Error) => {
        const failEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
          );
        await interaction.reply({ embeds: [failEmbed], flags: "Ephemeral" });
        return null;
      });
      if (!user) return;

      const userPoints = await pointsSchema.find({
        userId: user.id,
        guildId: guild.id,
      });
      const Bots = guild.members.cache.get(user.id);
      if (Bots.user.bot) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("***:x: Bots cannot have any points.***");
        return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
      }

      const noPoints = new EmbedBuilder()
        .setDescription(
          `***:warning: ${user.username || user.user.username} has no Points***`
        )
        .setColor("Red");
      if (userPoints.length < 1 || userPoints[0].points <= 0)
        return await interaction.reply({
          embeds: [noPoints],
          flags: "Ephemeral",
        });

      let embedDescription = `**Points:** ${userPoints[0].points}P`;

      const embed = new EmbedBuilder()
        .setTitle(`***${user.username || user.user.username}'s Points***`)
        .setDescription(`${embedDescription}`)
        .setColor("Random");
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    } catch (err) {
      return;
    }
  },
});
