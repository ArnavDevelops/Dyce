import {
  EmbedBuilder,
  PermissionsBitField,
  InteractionContextType,
  ApplicationCommandOptionType,
  GuildMember,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "unmute",
  description: "Kicks a user",
  defaultMemberPermissions: ["ModerateMembers"],
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "user",
      description: "Select the user or input a userID",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "The reason",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "note",
      description: "Anything to note about this particular action?",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async ({ interaction, args }) => {
    try {
      const { guild, member } = interaction;

      const untimeMember = args.getMember("user") as GuildMember;
      if (!untimeMember) return;
      const reason = args.getString("reason");

      if (untimeMember.communicationDisabledUntilTimestamp < Date.now()) {
        const notInTimeoutEmbed = new EmbedBuilder()
          .setDescription(
            "***:warning: The user you mentioned is not muted/in a timeout.***"
          )
          .setColor("Red");
        return await interaction.reply({
          embeds: [notInTimeoutEmbed],
          flags: ["Ephemeral"],
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
        return await interaction.reply({ embeds: [embed4], flags: ["Ephemeral"] });

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
      return await interaction
        .reply({ embeds: [embed1] })
        .catch((err: Error) => {
          return;
        });
    } catch (err) {
      const embed2 = new EmbedBuilder()
        .setDescription("***:warning: This user is not in this server.***")
        .setColor(`Red`);
      return await interaction.reply({ embeds: [embed2], flags: ["Ephemeral"] });
    }
  },
});
