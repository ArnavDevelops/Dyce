import {
  EmbedBuilder,
  PermissionsBitField,
  InteractionContextType,
  ApplicationCommandOptionType,
} from "discord.js";
import modNotesSchema from "../../schemas/modNotesSchema";
import warnModel from "../../schemas/warnSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "warn",
  description: "Warns a user",
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
    const { member, guild } = interaction;

    const e = args.getUser("user");
    const user = await guild.members.fetch(e).catch(async (err: Error) => {
      const failEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
        );
      await interaction.reply({ embeds: [failEmbed], flags: ["Ephemeral"] });
      return null;
    });
    if (!user) return;
    const reason = args.getString("reason");
    const note = args.getString("note");

    if (user.id == member.id) {
      const cannotWarnYourself = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You cannot warn yourself***");
      return await interaction.reply({
        embeds: [cannotWarnYourself],
        flags: ["Ephemeral"],
      });
    }

    if (user.user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You cannot warn bots!***");
      return interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
    }

    if (user.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      const cannotWarnMyself = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: I can't warn myself nor a Moderator.***");
      return await interaction.reply({
        embeds: [cannotWarnMyself],
        flags: ["Ephemeral"],
      });
    }

    await new warnModel({
      userId: user.id,
      guildId: interaction.guildId,
      moderatorId: member.id,
      reason,
      timestamp: Date.now(),
    }).save();

    const embed = new EmbedBuilder()
      .setDescription(
        `***⚠️ You have been warned in ${guild.name} by ${member.user.username} || Reason: ${reason}***`
      )
      .setColor("Red");
    await user.send({ embeds: [embed] }).catch((err: Error) => {
      return;
    });

    const DMembed = new EmbedBuilder()
      .setDescription(
        `***⚠️ ${user.user.username} has been warned || Reason: ${reason}***`
      )
      .setColor("Green");
    await interaction.reply({ embeds: [DMembed] });

    try {
      if (note) {
        return await new modNotesSchema({
          guildId: guild.id,
          moderatorId: interaction.user.id,
          command: "/warn",
          date: Date.now(),
          note: `Moderated: ${user.user.username} | **${note}**`,
        }).save();
      }
    } catch (err) {
      return;
    }
  },
});
