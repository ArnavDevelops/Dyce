const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const ModSchema = require("../../schemas/warnModel.js");
const moment = require("moment");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Check your warnings or another user's warnings.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user.setName("user").setDescription("Select the user.")
    ),
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const warn = options.getMember("user") || interaction.user;
    const userInGuild = guild.members.cache.get(warn.id);

    const userWarnings = await ModSchema.find({
      userId: warn.id,
      guildId: guild.id,
    });

    if (userInGuild.user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: Bots cannot have any warnings.***");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (userInGuild.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      const embed1 = new EmbedBuilder()
        .setColor("Yellow")
        .setDescription(
          "***:warning: Moderators and above cannot have any warnings.***"
        );
      return await interaction.reply({ embeds: [embed1], ephemeral: true });
    }

    const noWarnings = new EmbedBuilder()
      .setDescription(
        `***:warning: ${
          warn.username || warn.user.username
        } has no warnings.***`
      )
      .setColor("Red");
    if (userWarnings.length < 1)
      return interaction.reply({ embeds: [noWarnings], ephemeral: true });

    const embedDescription = userWarnings
      .map((warn) => {
        return [
          `**warn ID:** ${warn.id}`,
          `**Date:** ${moment(warn.timestamp).format("MMMM Do YYYY")}`,
          `**Reason:** ${warn.reason}`,
        ].join("\n");
      })
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle(`***${warn.username || warn.user.username}'s warnings***`)
      .setDescription(embedDescription)
      .setColor("Yellow");
    interaction.reply({ embeds: [embed] });
  },
};
