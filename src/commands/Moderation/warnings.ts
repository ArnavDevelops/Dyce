import {
  EmbedBuilder,
  PermissionsBitField,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ApplicationCommandOptionType,
  InteractionContextType,
} from "discord.js";
import warnModel from "../../schemas/warnModel";
import { Command } from "../../structures/Command";

export default new Command({
  name: "warnings",
  description: "Checks if the user have any warnings or not",
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "user",
      description: "Select the user or leave it to see your own",
      type: ApplicationCommandOptionType.User,
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;

    const warn = args.getUser("user") || interaction.user;
    const userInGuild = guild.members.cache.get(warn.id);
    let warnsBoard = [""];
    const page = 1;
    const warnsPerPage = 5;
    const warnsToSkip = (page - 1) * warnsPerPage;

  
    const data = await warnModel
      .find({ guildId: guild.id, userId: warn.id })
      .limit(warnsPerPage)
      .skip(warnsToSkip)
      .exec();

    if (userInGuild.user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: Bots cannot have any warnings.***");
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    }

    if (userInGuild.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setDescription(
          "***:warning: moderators and above cannot have any warnings.***"
        );
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    }

    const noWarnings = new EmbedBuilder()
      .setDescription(`***:warning: ${warn.username} has no warnings.***`)
      .setColor("Red");
    if (data.length < 1) return interaction.reply({ embeds: [noWarnings] });

    let warns = warnsToSkip + 1;

    const previousButton = new ButtonBuilder()
      .setCustomId(`warnsBoard:previous:${warn.id}:${page}`)
      .setLabel("⬅️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 1);
    const nextButton = new ButtonBuilder()
      .setCustomId(`warnsBoard:next:${warn.id}:${page}`)
      .setLabel("➡️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(data.length < warnsPerPage);
    const row = new ActionRowBuilder().addComponents(
      previousButton,
      nextButton
    );

    if (
      interaction.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
      )
    ) {
      for (const warn of data) {
        warnsBoard += ([
          `**warn ID:** ${warn._id}`,
          `**Date:** <t:${Math.round((warn.timestamp as any) / 1000)}>`,
          `**Reason:** ${warn.reason}`,
        ].join("\n") + "\n\n") as any;
        warns++;
      }

      const embed = new EmbedBuilder()
        .setTitle(`***${warn.username}'s warnings***`)
        .setDescription(warnsBoard as any)
        .setColor("Yellow");
      await interaction.reply({
        embeds: [embed],
        components: [row.toJSON()],
        flags: "Ephemeral",
      });
    } else {
      for (const warn of data) {
        warnsBoard += ([
          `**Date:** <t:${Math.round((warn.timestamp as any) / 1000)}>`,
          `**Reason:** ${warn.reason}`,
        ].join("\n") + "\n\n") as any;
        warns++;
      }

      const embed = new EmbedBuilder()
        .setTitle(`***${warn.username}'s warnings***`)
        .setDescription(warnsBoard as any)
        .setColor("Yellow")
        .setFooter({
          text: "WarnID is hidden as the interaction user is not a Moderator.",
          iconURL: `${warn.avatarURL()}`,
        });
      return await interaction.reply({
        embeds: [embed],
        components: [row.toJSON()],
      });
    }
  },
});
