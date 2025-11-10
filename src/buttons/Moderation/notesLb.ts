import { Button } from "../../structures/Button";
import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionsBitField,
  GuildMember,
} from "discord.js";
import modNotesSchema from "../../schemas/modNotesSchema";

export default new Button("notesBoard:", async ({ interaction }) => {
  const { customId, guild } = interaction;
  const member = interaction.member as GuildMember;

  if (!member || !("roles" in member)) return;

  let page: any;
  let moderator;
  if (customId.startsWith("notesBoard:next:")) {
    page = parseInt(customId.split(`:`)[3]) + 1;
    moderator = guild.members.cache.get(customId.split(`:`)[2]);
  } else if (customId.startsWith(`notesBoard:previous:`)) {
    page = parseInt(customId.split(`:`)[3]) - 1;
    moderator = guild.members.cache.get(customId.split(`:`)[2]);
  }

  const permission = member.permissions.has(
    PermissionsBitField.Flags.ModerateMembers
  );

  const permissionEmbed = new EmbedBuilder()
    .setColor("Red")
    .setDescription(
      "***:warning: You don't have the permission `Manage Messages` to use this Command.***"
    );
  if (!permission)
    return interaction.reply({ embeds: [permissionEmbed], flags: "Ephemeral" });

  const notesPerPage = 5;
  const notesToSkip = (page - 1) * notesPerPage;
  const data = await modNotesSchema
    .find({
      guildId: interaction.guild.id,
      moderatorId: moderator.id || moderator.user.id,
    })
    .limit(notesPerPage)
    .skip(notesToSkip);

  let notesBoard = ``;
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

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(
        `notesBoard:previous:${moderator.id || moderator.user.id}:${page}`
      )
      .setLabel(`⬅️`)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId(
        `notesBoard:next:${moderator.id || moderator.user.id}:${page}`
      )
      .setLabel(`➡️`)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(data.length < notesPerPage)
  );

  const embed = new EmbedBuilder()
    .setTitle(`***${moderator.user.username || moderator.username}'s Notes***`)
    .setDescription(notesBoard)
    .setColor("Yellow");

  await interaction.update({
    embeds: [embed],
    components: [row.toJSON()],
  });
});
