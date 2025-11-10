import {
  EmbedBuilder,
  PermissionsBitField,
  InteractionContextType,
  ApplicationCommandOptionType,
  GuildMember,
} from "discord.js";
import modNotesSchema from "../../schemas/modNotesSchema";
import { toMs } from "ms-typescript";
import getDurationString from "../../typings/getDurationString";
import { Command } from "../../structures/Command";

export default new Command({
  name: "mute",
  description: "Mutes a user",
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
      name: "duration",
      description: "the duration (Format: <number><unit> such as 1h)",
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
      //Variables
      const { guild, member } = interaction;
      const timeMember = args.getMember("user") as GuildMember;
      if (!timeMember) return;
      const duration = args.getString("duration");
      const note = args.getString("note");

      const durationRegex = /^\d+[smhdw]$/; // Modify this to include other units if needed
      if (!durationRegex.test(duration)) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: You can only use the format '<number><unit>', where unit can be 's'(seconds), m'(minutes), h' (hours), 'd' (days), or 'w' (weeks).***"
          );
        return await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
      } else {
        if (timeMember.communicationDisabledUntilTimestamp > Date.now()) {
          const InTimeoutEmbed = new EmbedBuilder()
            .setDescription(
              "***:warning: The user you mentioned is already muted/in timeout.***"
            )
            .setFooter({
              text: "If you think this was a mistake please try again or try troubleshooting (mute and umute the member) or join our support server",
              iconURL:
                "https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&",
            })
            .setColor("Red");
          return await interaction.reply({
            embeds: [InTimeoutEmbed],
            flags: ["Ephemeral"],
          });
        } else {
          const embed3 = new EmbedBuilder()
            .setDescription("***:x: You cannot timeout/mute yourself!***")
            .setColor("Red");
          if (member.id === timeMember.id)
            return await interaction.reply({
              embeds: [embed3],
              flags: ["Ephemeral"],
            });

          if (timeMember.user.bot) {
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription("***:x: You cannot timeout/mute bots.***");
            return await interaction.reply({
              embeds: [embed],
              flags: ["Ephemeral"],
            });
          }

          const embed4 = new EmbedBuilder()
            .setDescription(
              `***:x: I cannot timeout/mute Moderators and Above.***`
            )
            .setColor("Red");
          if (
            timeMember.permissions.has(PermissionsBitField.Flags.ManageMessages)
          )
            return await interaction.reply({
              embeds: [embed4],
              flags: ["Ephemeral"],
            });

          const reason = args.getString("reason");

          await timeMember.timeout(toMs(duration), reason);
          const durationMs = toMs(duration);
          const durationString = getDurationString(durationMs);

          const dmEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `***⏳ You have been timed out/muted in ${guild.name} by ${member.user.username} for ${durationString}***`
            )
            .addFields({ name: `Reason`, value: `${reason}` });

          await timeMember.send({ embeds: [dmEmbed] }).catch((err: Error) => {
            return;
          });

          const embed1 = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `***⏳ ${timeMember.user.username} has been muted/timed out for ${durationString}***`
            )
            .addFields({ name: `Reason`, value: `${reason}` });

          await interaction.deferReply();
          await interaction
            .followUp({ embeds: [embed1] })
            .catch((err: Error) => {
              return;
            });

          if (note) {
            new modNotesSchema({
              guildId: guild.id,
              moderatorId: interaction.user.id,
              command: "/mute",
              date: Date.now(),
              note: `Moderated: ${timeMember.user.username} | **${note}**`,
            }).save();
          }
        }
      }
    } catch (err) {
      const embed2 = new EmbedBuilder()
        .setDescription(
          "***:warning: Error executing this command make sure that the user is in the server.***"
        )
        .setColor("Red");
      return await interaction.reply({ embeds: [embed2], flags: ["Ephemeral"] });
    }
  },
});
