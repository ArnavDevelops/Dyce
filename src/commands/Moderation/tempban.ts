//Imports
import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits } from "discord.js";
import modNotesSchema from "../../schemas/modNotesSchema";
import tempBanSchema from "../../schemas/tempBanSchema"
import { toMs } from "ms-typescript";
import getDurationString from "../../helpers/getDurationString";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tempban")
    .setDescription("Temporarily bans a specific user.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user.setName("user").setDescription("Select the user.").setRequired(true)
    )
    .addStringOption((duration) =>
      duration
        .setName("duration")
        .setDescription("Choose a duration for it.")
        .setRequired(true)
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
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction: any, client: any) {
    try {
      //Variables
      const { options, guild, member } = interaction;
      const banMember = options.getMember("user");
      const duration = options.getString("duration");
      const note = options.getString("note");

      const durationRegex = /^\d+[smhdw]$/; // Modify this to include other units if needed
      if (!durationRegex.test(duration)) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("***:warning: You can only use the format '<number><unit>', where unit can be 's'(seconds), m'(minutes), h' (hours), 'd' (days), or 'w' (weeks).***")
        return await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        const embed3 = new EmbedBuilder()
          .setDescription("***:x: You cannot timeout yourself!***")
          .setColor("Red");
        if (member.id === banMember.id)
          return await interaction.reply({ embeds: [embed3], ephemeral: true });

        if (banMember.user.bot) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("***:x: You cannot ban bots.***");
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed4 = new EmbedBuilder()
          .setDescription(`***:x: I cannot ban Moderators and Above.***`)
          .setColor("Red");
        if (banMember.permissions.has(PermissionsBitField.Flags.ManageMessages))
          return await interaction.reply({ embeds: [embed4], ephemeral: true });

        const data = await tempBanSchema.findOne({ guildId: guild.id, userId: banMember.id });
        if (data) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("***:x: You cannot ban people who are already temp banned.***");
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {

          const reason = options.getString("reason");
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

          await interaction.deferReply()
          await interaction.followUp({ embeds: [embed1] }).catch((err: Error) => {
            return;
          });

          await guild.bans.create(banMember.id, { reason: reason }).catch((err: Error) => {
            return;
          });
          new tempBanSchema({
            guildId: guild.id,
            userId: banMember.id,
            time: durationMs,
          }).save().then(async (data) => {
            setTimeout(async () => {
              await guild.bans.remove(banMember.id).catch((err: Error) => { return; })
              return await tempBanSchema.deleteOne({ guildId: guild.id, userId: banMember.id })
            }, data.time as any)
          })
          //If there is a note for this action
          if (note) {
            new modNotesSchema({
              guildId: guild.id,
              moderatorId: interaction.user.id,
              command: "/tempban",
              date: Date.now(),
              note: `Moderated: ${banMember.user.username} | **${note}**`
            }).save()
          }
        }
      }
    } catch (err) {
      const embed2 = new EmbedBuilder()
        .setDescription("***:warning: Error executing this command make sure that the user is in the server.***")
        .setColor("Red");
      return await interaction.reply({ embeds: [embed2], ephemeral: true });
    }
  }
}