const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const modNotesSchema = require("../../schemas/modNotesSchema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a specific user.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user
        .setName("user")
        .setDescription(
          "Select the user you want to ban, you can also use User ID."
        )
        .setRequired(true)
    )
    .addStringOption((reason) =>
      reason
        .setName("reason")
        .setDescription("Provide a reason for it.")
        .setRequired(true)
    )
    .addStringOption((reason) =>
    reason
      .setName("note")
      .setDescription("Any notes for this action?.")
      .setRequired(false)
    ),
  async execute(interaction, client) {
    const { member, options, guild } = interaction;
    const kickUser = options.getUser("user");
    const kickMember = await guild.members
      .fetch(kickUser.id)
      .catch(async (err) => {
        const failEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: There was an error kicking the user, please make sure that the user is in the server.***"
          );
        await interaction.reply({ embeds: [failEmbed], ephemeral: true });
        return null;
      });
    if (!kickMember) return;
    const reason = options.getString("reason");

    const permission = member.permissions.has(
      PermissionsBitField.Flags.KickMembers
    );

    const permissionEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "***:warning: You don't have the permission `Kick Members` to use this Command.***"
      );
    if (!permission)
      return interaction.reply({ embeds: [permissionEmbed], ephemeral: true });

    if (kickMember.id == member.id) {
      const cannotkickyourself = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You can't kick yourself.***");
      return await interaction.reply({
        embeds: [cannotkickyourself],
        ephemeral: true,
      });
    }

    if (kickMember.user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You cannot kick bots.***");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (kickMember.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      const cannotkickmod = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: I can't kick Moderators and Above.***");
      return await interaction.reply({ embeds: [cannotkickmod] });
    }
    try {
      const dmEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `***:white_check_mark: You have been kicked from ${guild.name} by ${member.user.username}***`
        )
        .addFields({
          name: "Reason",
          value: `${reason}`,
        });
      await kickMember.send({ embeds: [dmEmbed] }).catch((err) => {
        return;
      });

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `***:white_check_mark: Successfully kicked ${kickUser.username}***`
        )
        .addFields({
          name: "Reason",
          value: `${reason}`,
        });
      interaction.reply({ embeds: [embed] });

      await kickMember.kick({ reason: reason });

      if (note) {
        new modNotesSchema({
          guildId: guild.id,
          moderatorId: interaction.user.id,
          command: "/kick",
          date: Date.now(),
          note: `Moderated: ${kickMember.user.username} | **${note}**`
        }).save()
      }
    } catch (err) {
      return;
    }
  },
};
