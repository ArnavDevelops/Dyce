//Imports
import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonStyle, ButtonBuilder, ActionRowBuilder } from "discord.js";
import warnModel from "../../schemas/warnModel"

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Check your warnings or another user's warnings.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user.setName("user").setDescription("Select the user.")
    ),
  async execute(interaction: any, client: any) {
    const { options, guild } = interaction;
    //Variables
    const warn = options.getUser("user") || interaction.user;
    const userInGuild = guild.members.cache.get(warn.id);
    let warnsBoard = [""];
    const page = 1;
    const warnsPerPage = 5;
    const warnsToSkip = (page - 1) * warnsPerPage;

    //Data
    const data = await warnModel.find({ guildId: guild.id, userId: warn.id }).limit(warnsPerPage).skip(warnsToSkip).exec();

    if (userInGuild.user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: Bots cannot have any warnings.***");
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (userInGuild.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      const embed1 = new EmbedBuilder()
        .setColor("Yellow")
        .setDescription(
          "***:warning: moderators and above cannot have any warnings.***"
        );
      return await interaction.reply({ embeds: [embed1], ephemeral: true });
    }

    const noWarnings = new EmbedBuilder()
      .setDescription(
        `***:warning: ${warn.username} has no warnings.***`
      )
      .setColor("Red");
    if (data.length < 1)
      return interaction.reply({ embeds: [noWarnings] })


    let warns = warnsToSkip + 1;

    //Buttons
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

    if (interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      for (const warn of data) {
        warnsBoard += [
          `**warn ID:** ${warn._id}`,
          `**Date:** <t:${Math.round(warn.timestamp as any / 1000)}>`,
          `**Reason:** ${warn.reason}`,
        ].join("\n") + "\n\n" as any;
        warns++;
      }

      const embed = new EmbedBuilder()
        .setTitle(`***${warn.username}'s warnings***`)
        .setDescription(warnsBoard as any)
        .setColor("Yellow");
      await interaction.reply({ embeds: [embed], components: [row] });
    } else {
      for (const warn of data) {
        warnsBoard += [
          `**Date:** <t:${Math.round(warn.timestamp as any/ 1000)}>`,
          `**Reason:** ${warn.reason}`,
        ].join("\n") + "\n\n" as any;
        warns++;
      }

      const embed = new EmbedBuilder()
        .setTitle(`***${warn.username}'s warnings***`)
        .setDescription(warnsBoard as any)
        .setColor("Yellow")
        .setFooter({ text: "WarnID is hidden as the Command user is not a moderator", iconURL: `${warn.avatarURL() || warn.user.avatarURL()}` })
      return await interaction.reply({ embeds: [embed], components: [row] });
    }
  },
};
