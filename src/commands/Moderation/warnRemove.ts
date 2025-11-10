import {
  EmbedBuilder,
  InteractionContextType,
  ApplicationCommandOptionType,
} from "discord.js";
import warnModel from "../../schemas/warnModel";
import { Command } from "../../structures/Command";

export default new Command({
  name: "warn-remove",
  description: "Removes a warning",
  defaultMemberPermissions: ["ModerateMembers"],
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "single",
      description: "Removes a single warning",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "warnid",
          description: "The ID of the warning",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "all",
      description: "Removes all warnings",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;
    if (args.getSubcommand() === "single") {
      const warnId = args.getString("warnid");

      const data = await warnModel.findById(warnId);
      if (data == null) return;
      const user = guild.members.cache.get(data.userId);
      if (!data) {
        const NotValidEmbed = new EmbedBuilder()
          .setDescription(`***:warning: ${warnId} is not a valid Warn ID*.**`)
          .setColor("Red");
        return await interaction.reply({
          embeds: [NotValidEmbed],
          flags: ["Ephemeral"],
        });
      }
      await data.deleteOne();

      const embed = new EmbedBuilder()
        .setDescription(
          `***:white_check_mark: successfully deleted 1 of ${user.user.username}'s warnings. ||\n warn ID: ${warnId}***`
        )
        .setColor("Green");
      return await interaction.reply({ embeds: [embed] });
    }

    if (args.getSubcommand() === "all") {
      const user = args.getUser("user");

      const data = await warnModel.find({ userId: user.id });

      const noWarnings = new EmbedBuilder()
        .setDescription(`***:warning: ${user.username} has no warnings.***`)
        .setColor("Red");
      if (!data || data.length < 1)
        return await interaction.reply({
          embeds: [noWarnings],
          flags: ["Ephemeral"],
        });

      await warnModel.deleteMany({ userId: user.id });
      const embed = new EmbedBuilder()
        .setDescription(
          `***:white_check_mark: Successfully deleted all of ${user.username}'s warnings.***`
        )
        .setColor("Green");
      return await interaction.reply({ embeds: [embed] });
    }
  },
});
