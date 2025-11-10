import {
  EmbedBuilder,
  PermissionsBitField,
  InteractionContextType,
  ApplicationCommandOptionType,
} from "discord.js";
import modNotesSchema from "../../schemas/modNotesSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "kick",
  description: "Kicks a user",
  defaultMemberPermissions: ["KickMembers"],
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
    const { guild } = interaction;

    const user = args.getUser("user");
    const note = args.getString("note");
    const member = await guild.members
      .fetch(user.id)
      .catch(async (err: Error) => {
        const failEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: There was an error kicking the user, please make sure that the user is in the server.***"
          );
        await interaction.reply({ embeds: [failEmbed], flags: ["Ephemeral"] });
        return null;
      });
    if (!member) return;
    const reason = args.getString("reason");

    if (member.user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You cannot kick bots.***");
      return interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
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
      await member.send({ embeds: [dmEmbed] }).catch((err: Error) => {
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

      if (note) {
        await new modNotesSchema({
          guildId: guild.id,
          moderatorId: interaction.user.id,
          command: "/kick",
          date: Date.now(),
          note: `Moderated: ${member.user.username} | **${note}**`,
        }).save();
      }
    } catch (err) {
      return;
    }
  },
});
