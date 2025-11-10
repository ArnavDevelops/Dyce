import {
  EmbedBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ApplicationCommandOptionType,
  InteractionContextType,
} from "discord.js";
import modNotesSchema from "../../schemas/modNotesSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "mod-notes",
  description: "Checks your notes or other moderators' notes",
  defaultMemberPermissions: ["ManageMessages"],
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "user",
      description: "Select the user or input a userID",
      type: ApplicationCommandOptionType.User,
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;

    const moderator = args.getUser("moderator") || interaction.user;
    if (!moderator) return;
    const userInGuild = guild.members.cache.get(moderator.id);
    let notesBoard = ``;
    const page = 1;
    const notesPerPage = 5;
    const notesToSkip = (page - 1) * notesPerPage;

    const data = await modNotesSchema
      .find({ moderatorId: moderator.id, guildId: guild.id })
      .limit(notesPerPage)
      .skip(notesToSkip);

    let notes = notesToSkip + 1;

    for (const moderator of data) {
      notesBoard +=
        [
          `**Command:** ${moderator.command}`,
          `**Date:** <t:${Math.round((moderator.date as any) / 1000)}>`,
          `**Note:** ${moderator.note}`,
        ].join("\n") + "\n\n";
      notes++;
    }

    if (
      !userInGuild.permissions.has(PermissionsBitField.Flags.ManageMessages)
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "***:warning: The user must be a moderator/staff in the server.***"
        );
      return await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
    }

    const noNotes = new EmbedBuilder()
      .setDescription(
        `***:warning: ${
          moderator.username || userInGuild.user.username
        } has no notes.***`
      )
      .setColor("Red");
    if (data.length < 1) return await interaction.reply({ embeds: [noNotes] });

    const previousButton = new ButtonBuilder()
      .setCustomId(
        `notesBoard:previous:${moderator.id || userInGuild.user.id}:${page}`
      )
      .setLabel("⬅️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 1);
    const nextButton = new ButtonBuilder()
      .setCustomId(
        `notesBoard:next:${moderator.id || userInGuild.user.id}:${page}`
      )
      .setLabel("➡️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(data.length < notesPerPage);
    const row = new ActionRowBuilder().addComponents(
      previousButton,
      nextButton
    );

    const embed = new EmbedBuilder()
      .setTitle(
        `***${moderator.username || userInGuild.user.username}'s Notes***`
      )
      .setDescription(notesBoard)
      .setColor("Yellow");
    return await interaction.reply({
      embeds: [embed],
      components: [row.toJSON()],
    });
  },
});
