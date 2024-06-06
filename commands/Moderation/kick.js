//Imports
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField
} = require("discord.js");
const modNotesSchema = require("../../schemas/modNotesSchema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user
        .setName("user")
        .setDescription(
          "Select the user you want to ban, you can also use user ID."
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
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction, client) {
    const { options, guild } = interaction;

    //Variables
    const user = options.getUser("user");
    const member = await guild.members
      .fetch(user.id)
      .catch(async (err) => {
        const failEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: There was an error kicking the user, please make sure that the user is in the server.***"
          );
        await interaction.reply({ embeds: [failEmbed], ephemeral: true });
        return null;
      });
    if (!member) return;
    const reason = options.getString("reason");

    if (member.user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You cannot kick bots.***");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
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
      await member.send({ embeds: [dmEmbed] }).catch((err) => {
        return;
      });

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `***:white_check_mark: Successfully kicked ${user.username}***`
        )
        .addFields({
          name: "Reason",
          value: `${reason}`,
        });
      await interaction.reply({ embeds: [embed] });

      await member.kick({ reason: reason });

      //If there is a note for the action
      if (note) {
        await new modNotesSchema({
          guildId: guild.id,
          moderatorId: interaction.user.id,
          command: "/kick",
          date: Date.now(),
          note: `Moderated: ${member.user.username} | **${note}**`
        }).save()
      }
    } catch (err) {
      return;
    }
  },
};
