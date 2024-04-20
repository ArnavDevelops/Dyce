const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const warnModel = require("../../schemas/warnModel.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a specific user.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user.setName("user").setDescription("Select the user.").setRequired(true)
    )
    .addStringOption((reason) =>
      reason
        .setName("reason")
        .setDescription("Provide a reason.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { options, member, guild } = interaction;
    const e = options.getUser("user");
    const user = await guild.members.fetch(e).catch(async (err) => {
      const failEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
        );
      await interaction.reply({ embeds: [failEmbed], ephemeral: true });
      return null;
    });
    if (!user) return;
    const reason = options.getString("reason");

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

    if (user.id == member.id) {
      const cannotWarnYourself = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You cannot warn yourself***");
      return await interaction.reply({
        embeds: [cannotWarnYourself],
        ephemeral: true,
      });
    }

    if (user.user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You cannot warn bots!***");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (user.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      const cannotWarnMyself = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: I can't warn myself nor a Moderator.***");
      return await interaction.reply({
        embeds: [cannotWarnMyself],
        ephemeral: true,
      });
    }

    new warnModel({
      userId: user.id,
      guildId: interaction.guildId,
      moderatorId: member.id,
      reason,
      timestamp: Date.now(),
    }).save();

    const embed = new EmbedBuilder()
      .setDescription(
        `***⚠️ You have been warned in ${guild.name} by ${member.user.username} || Reason: ${reason}***`
      )
      .setColor("Red");
    user.send({ embeds: [embed] }).catch((err) => {
      return;
    });

    const DMembed = new EmbedBuilder()
      .setDescription(
        `***⚠️ ${user.user.username} has been warned || Reason: ${reason}***`
      )
      .setColor("Green");
    interaction.reply({ embeds: [DMembed] });
  },
};
