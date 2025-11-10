import {
  EmbedBuilder,
  PermissionsBitField,
  InteractionContextType,
  ApplicationCommandOptionType,
  GuildMember,
} from "discord.js";
import modNotesSchema from "../../schemas/modNotesSchema";
import tempBanSchema from "../../schemas/tempBanSchema";
import { toMs } from "ms-typescript";
import getDurationString from "../../typings/getDurationString";
import { Command } from "../../structures/Command";

export default new Command({
  name: "tempban",
  description: "Bans a user temporarialy",
  defaultMemberPermissions: ["BanMembers"],
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
      description: "The duration (Eg., 1h)",
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
      const banMember = args.getMember("user") as GuildMember;
      if (!banMember) return;
      const duration = args.getString("duration");
      const note = args.getString("note");

      const durationRegex = /^\d+[smhdw]$/;

      if (!durationRegex.test(duration)) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: You can only use the format '<number><unit>', where unit can be 's'(seconds), m'(minutes), h' (hours), 'd' (days), or 'w' (weeks).***"
          );
        return await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
      } else {
        const embed3 = new EmbedBuilder()
          .setDescription("***:x: You cannot timeout yourself!***")
          .setColor("Red");
        if (member.id === banMember.id)
          return await interaction.reply({ embeds: [embed3], flags: ["Ephemeral"] });

        if (banMember.user.bot) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("***:x: You cannot ban bots.***");
          return await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
        }

        const embed4 = new EmbedBuilder()
          .setDescription(`***:x: I cannot ban Moderators and Above.***`)
          .setColor("Red");
        if (banMember.permissions.has(PermissionsBitField.Flags.ManageMessages))
          return await interaction.reply({ embeds: [embed4], flags: ["Ephemeral"] });

        const data = await tempBanSchema.findOne({
          guildId: guild.id,
          userId: banMember.id,
        });
        if (data) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:x: You cannot ban people who are already temp banned.***"
            );
          return await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
        } else {
          const reason = args.getString("reason");
          const durationMs = toMs(duration);
          const durationString = getDurationString(durationMs);

          const dmEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `***⏳ You have been banned in ${guild.name} by ${member.user.username} for ${durationString}***`
            )
            .addFields({ name: `Reason`, value: `${reason}` });

          await banMember.send({ embeds: [dmEmbed] }).catch((err: Error) => {
            return;
          });

          const embed1 = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `***⏳ ${banMember.user.username} has been banned for ${durationString}***`
            )
            .addFields({ name: `Reason`, value: `${reason}` });

          await interaction.deferReply();
          await interaction
            .followUp({ embeds: [embed1] })
            .catch((err: Error) => {
              return;
            });

          await guild.bans
            .create(banMember.id, { reason: reason })
            .catch((err: Error) => {
              return;
            });
          new tempBanSchema({
            guildId: guild.id,
            userId: banMember.id,
            time: durationMs,
          })
            .save()
            .then(async (data) => {
              setTimeout(async () => {
                await guild.bans.remove(banMember.id).catch((err: Error) => {
                  return;
                });
                return await tempBanSchema.deleteOne({
                  guildId: guild.id,
                  userId: banMember.id,
                });
              }, data.time as any);
            });

          if (note) {
            new modNotesSchema({
              guildId: guild.id,
              moderatorId: interaction.user.id,
              command: "/tempban",
              date: Date.now(),
              note: `Moderated: ${banMember.user.username} | **${note}**`,
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
