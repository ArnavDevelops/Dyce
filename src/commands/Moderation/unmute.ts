//Imports
import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField,PermissionFlagsBits } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Removes the timeout from a already muted user.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user.setName("user").setDescription("Select the user.").setRequired(true)
    )
    .addStringOption((reason) =>
      reason.setName("reason").setDescription("Please provide a reason for it.").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction: any, client: any) {
    try {
      const { options, guild, member } = interaction;

      //Variables
      const untimeMember = options.getMember("user");
      const reason = options.getString("reason")

      if (untimeMember.communicationDisabledUntilTimestamp < Date.now()) {
        const notInTimeoutEmbed = new EmbedBuilder()
          .setDescription(
            "***:warning: The user you mentioned is not muted/in a timeout.***"
          )
          .setColor("Red");
        return await interaction.reply({
          embeds: [notInTimeoutEmbed],
          ephemeral: true,
        });
      }

      const embed4 = new EmbedBuilder()
        .setDescription(
          "***:warning: I cannot remove timeout/mute of Moderators and Above.***"
        )
        .setColor("Red");
      if (
        untimeMember.permissions.has(PermissionsBitField.Flags.ManageMessages)
      )
        return await interaction.reply({ embeds: [embed4], ephemeral: true });

      await untimeMember.timeout(null, reason);

      const dmEmbed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `***⏳ Your timeout/mute has been removed in ${guild.name} by ${member.user.username}***`
        )
        .addFields({ name: "Reason", value: reason });
      await untimeMember.send({ embeds: [dmEmbed] }).catch((err: Error) => {
        return;
      });

      const embed1 = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `***⌛ ${untimeMember.user.username}'s timeout/mute has been removed***`
        )
        .addFields({ name: "Reason", value: reason });
      return await interaction.reply({ embeds: [embed1] }).catch((err: Error) => {
        return;
      });
      
    } catch (err) {
      const embed2 = new EmbedBuilder()
        .setDescription("***:warning: This user is not in this server.***")
        .setColor(`Red`);
      return await interaction.reply({ embeds: [embed2], ephemeral: true });
    }
  },
};
