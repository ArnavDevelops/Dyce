//Imports
import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import warnModel from "../../schemas/warnModel"

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn-remove")
    .setDescription("remove a specific user's warning(s)")
    .setDMPermission(false)
    .addSubcommand((option) =>
      option
        .setName("single")
        .setDescription("Removes a single warning of a specific user.")
        .addStringOption((warnId) =>
          warnId
            .setName("warnid")
            .setDescription(
              "Get the warn ID so that you can remove the warning."
            )
        )
    )
    .addSubcommand((option) =>
      option
        .setName("all")
        .setDescription("Removes all of the warnings of a specific user.")
        .addUserOption((user) =>
          user.setName("user").setDescription("Select the user.")
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction: any, client: any) {
    const { options, guild } = interaction;

    //Single subcommand
    if (options.getSubcommand() === "single") {
      const warnId = options.getString("warnid");

      //Data
      const data = await warnModel.findById(warnId);
      if(data == null) return;
      const user = guild.members.cache.get(data.userId);
      if (!data) {
        const NotValidEmbed = new EmbedBuilder()
          .setDescription(`***:warning: ${warnId} is not a valid Warn ID*.**`)
          .setColor("Red");
        return await interaction.reply({ embeds: [NotValidEmbed], ephemeral: true });
      }
      await data.deleteOne();

      const embed = new EmbedBuilder()
        .setDescription(
          `***:white_check_mark: successfully deleted 1 of ${user.user.username}'s warnings. ||\n warn ID: ${warnId}***`
        )
        .setColor("Green");
      return await interaction.reply({ embeds: [embed] });
    }

    //All subcommand
    if (options.getSubcommand() === "all") {
      const user = options.getUser("user");
      //Data
      const data = await warnModel.find({ userId: user.id });

      const noWarnings = new EmbedBuilder()
        .setDescription(`***:warning: ${user.username} has no warnings.***`)
        .setColor("Red");
      if (!data || data.length < 1)
        return await interaction.reply({ embeds: [noWarnings], ephemeral: true });

      await warnModel.deleteMany({ userId: user.id });
      const embed = new EmbedBuilder()
        .setDescription(
          `***:white_check_mark: Successfully deleted all of ${user.username}'s warnings.***`
        )
        .setColor("Green");
      return await interaction.reply({ embeds: [embed] });
    }
  },
};
