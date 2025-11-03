import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionsBitField,
  GuildMember,
} from "discord.js";
import ModSchema from "../../schemas/warnModel";
import { Event } from "../../structures/Event";

export default new Event("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const { customId, guild } = interaction;
  const member = interaction.member as GuildMember;

  if (customId && customId.startsWith("warnsBoard:")) {
    let page: number;
    if (page == undefined) return;
    let user: GuildMember;
    if (customId.startsWith("warnsBoard:next:")) {
      page = parseInt(customId.split(`:`)[3]) + 1;
      user = guild.members.cache.get(customId.split(`:`)[2]);
    } else if (customId.startsWith(`warnsBoard:previous:`)) {
      page = parseInt(customId.split(`:`)[3]) - 1;
      user = guild.members.cache.get(customId.split(`:`)[2]);
    }

    const permission = member.permissions.has(
      PermissionsBitField.Flags.ModerateMembers
    );

    const warnsPerPage = 5;
    const warnsToSkip = (page - 1) * warnsPerPage;
    const data = await ModSchema.find({
      guildId: guild.id,
      userId: user.id || user.user.id,
    })
      .limit(warnsPerPage)
      .skip(warnsToSkip);

    let warnsBoard = ``;
    let warns = warnsToSkip + 1;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`warnsBoard:previous:${user.id}:${page}`)
        .setLabel(`⬅️`)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === 1),
      new ButtonBuilder()
        .setCustomId(`warnsBoard:next:${user.id}:${page}`)
        .setLabel(`➡️`)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(data.length < warnsPerPage)
    );

    if (permission) {
      for (const warn of data) {
        warnsBoard +=
          [
            `**warn ID:** ${warn._id}`,
            `**Date:** <t:${Math.round((warn.timestamp as any) / 1000)}>`,
            `**Reason:** ${warn.reason}`,
          ].join("\n") + "\n\n";
        warns++;
      }

      const embed = new EmbedBuilder()
        .setTitle(`***${user.user.username}'s warnings***`)
        .setDescription(warnsBoard)
        .setColor("Yellow");

      await interaction.update({
        embeds: [embed],
        components: [row.toJSON()],
      });
    } else {
      for (const warn of data) {
        warnsBoard +=
          [
            `**Date:** <t:${Math.round((warn.timestamp as any) / 1000)}>`,
            `**Reason:** ${warn.reason}`,
          ].join("\n") + "\n\n";
        warns++;
      }

      const embed = new EmbedBuilder()
        .setTitle(`***${user.user.username}'s warnings***`)
        .setDescription(warnsBoard)
        .setFooter({
          text: "WarnID is hidden as the Command user is not a moderator",
          iconURL: `${user.avatarURL() || user.user.avatarURL()}`,
        })
        .setColor("Yellow");

      await interaction.update({
        embeds: [embed],
        components: [row.toJSON()],
      });
    }
  }
});
