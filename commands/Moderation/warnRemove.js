const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const warnModel = require("../../schemas/warnModel.js");

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
    ),
  async execute(interaction, client) {
    const { options, guild, member } = interaction;
    const permission = member.permissions.has(
      PermissionsBitField.Flags.ManageMessages
    );

    const permissionEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "***:warning: You don't have the permission `Manage Messages` to use this Command.***"
      );
    if (!permission)
      return interaction.reply({ embeds: [permissionEmbed], ephemeral: true });

    if (options.getSubcommand() === "single") {
      const warnId = options.getString("warnid");
      const data = await warnModel.findById(warnId);
      const user = guild.members.cache.get(data.userId);

      const NotValidEmbed = new EmbedBuilder()
        .setDescription(`***:warning: ${warnId} is not a valid Warn ID*.**`)
        .setColor("Red");
      if (!data)
        return interaction.reply({ embeds: [NotValidEmbed], ephemeral: true });
      data.deleteOne();

      const embed = new EmbedBuilder()
        .setDescription(
          `***:white_check_mark: successfully deleted 1 of ${user.user.username}'s warnings. ||\n warn ID: ${warnId}***`
        )
        .setColor("Green");
      return interaction.reply({ embeds: [embed] });
    }

    if (options.getSubcommand() === "all") {
      const user = options.getUser("user");
      const userWarnings = await warnModel.find({
        userId: user.id,
      });

      const userId = user.id;
      const warnings = await warnModel.deleteMany({ userId });

      const noWarnings = new EmbedBuilder()
        .setDescription(`***:warning: ${user.username} has no warnings.***`)
        .setColor("Red");
      if (userWarnings.length < 1)
        return interaction.reply({ embeds: [noWarnings], ephemeral: true });

      const embed = new EmbedBuilder()
        .setDescription(
          `***:white_check_mark: Successfully deleted all of ${user.username}'s warnings.***`
        )
        .setColor("Green");
      return interaction.reply({ embeds: [embed] });
    }
  },
};
