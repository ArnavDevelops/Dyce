//Imports
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
} = require("discord.js");
const modNotesSchema = require("../../schemas/modNotesSchema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Times out or mutes a specific user.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user.setName("user").setDescription("Select the user.").setRequired(true)
    )
    .addStringOption((duration) =>
      duration
        .setName("duration")
        .setDescription("Choose a duration for it.")
        .setRequired(true)
        .addChoices(
          { name: "60 Seconds", value: "60" },
          { name: "2 Minutes", value: "120" },
          { name: "5 Minutes", value: "300" },
          { name: "10 Minutes", value: "600" },
          { name: "15 Minutes", value: "900" },
          { name: "20 Minutes", value: "1200" },
          { name: "30 Minutes", value: "1800" },
          { name: "45 Minutes", value: "2700" },
          { name: "1 Hour", value: "3600" },
          { name: "2 Hours", value: "7200" },
          { name: "3 Hours", value: "10800" },
          { name: "5 Hours", value: "18000" },
          { name: "10 hours", value: "36000" },
          { name: "1 Day", value: "86400" },
          { name: "2 Days", value: "172800" },
          { name: "3 Days", value: "259200" },
          { name: "5 Days", value: "4320000" },
          { name: "One Week", value: "604800" }
        )
    )
    .addStringOption((reason) =>
      reason
        .setName("reason")
        .setDescription("Please provide a reason for it.")
        .setRequired(true)
    )
    .addStringOption((note) =>
      note
        .setName("note")
        .setDescription("Any notes regarding this action?")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client) {
    try {
      //Variables
      const { options, guild, member } = interaction;
      const timeMember = options.getMember("user");
      const duration = options.getString("duration");
      const note = options.getString("note");

      if (timeMember.communicationDisabledUntilTimestamp !== null) {
        const InTimeoutEmbed = new EmbedBuilder()
          .setDescription(
            "***:warning: The user you mentioned is already in timeout.***"
          )
          .setColor("Red");
        return await interaction.reply({ embeds: [InTimeoutEmbed], ephemeral: true });
      }

      const embed3 = new EmbedBuilder()
        .setDescription("***:x: You cannot timeout yourself!***")
        .setColor("Red");
      if (member.id === timeMember.id)
        return await interaction.reply({ embeds: [embed3], ephemeral: true });

      if (timeMember.user.bot) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("***:x: You cannot timeout bots.***");
        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const embed4 = new EmbedBuilder()
        .setDescription(`***:x: I cannot timeout Moderators and Above.***`)
        .setColor("Red");
      if (timeMember.permissions.has(PermissionsBitField.Flags.ManageMessages))
        return await interaction.reply({ embeds: [embed4], ephemeral: true });

      const reason = options.getString("reason");

      await timeMember.timeout(duration * 1000, reason);
      const durationMs = parseInt(duration) * 1000;
      const durationString = getDurationString(durationMs);

      const dmEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `***⏳ You have been timed out in ${guild.name} by ${member.user.username} for ${durationString}***`
        )
        .addFields({ name: `Reason`, value: `${reason}` });

      await timeMember.send({ embeds: [dmEmbed] }).catch((err) => {
        return;
      });

      const embed1 = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `***⏳ ${timeMember.user.username} has been timed out for ${durationString}***`
        )
        .addFields({ name: `Reason`, value: `${reason}` });


      await interaction.deferReply()
      await interaction.followUp({ embeds: [embed1] }).catch((err) => {
        return;
      });

      //If there is a note for this action
      if (note) {
        new modNotesSchema({
          guildId: guild.id,
          moderatorId: interaction.user.id,
          command: "/timeout",
          date: Date.now(),
          note: `Moderated: ${timeMember.user.username} | **${note}**`
        }).save()
      }

    } catch (err) {
      const embed2 = new EmbedBuilder()
        .setDescription("***:warning: This user is not in this server***")
        .setColor("Red");
      return await interaction.reply({ embeds: [embed2], ephemeral: true });
    }

    function getDurationString(durationMs) {
      const seconds = Math.floor(durationMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);

      if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? "s" : ""}`;
      } else if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""}`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""}`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? "s" : ""}`;
      } else {
        return `${seconds} second${seconds !== 1 ? "s" : ""}`;
      }
    }
  },
};
