const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder
} = require("discord.js");
const ModSchema = require("../../schemas/warnModel.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Check your warnings or another user's warnings.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user.setName("user").setDescription("Select the user.")
    ),
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const warn = options.getMember("user") || interaction.user;
    const userInGuild = guild.members.cache.get(warn.id);

    let warnsBoard;
    const page = 1;
    const warnsPerPage = 5;
    const warnsToSkip = (page - 1) * warnsPerPage;

    const userWarnings = await ModSchema.find({ guildId: guild.id, userId: warn.user.id || warn.id }).limit(warnsPerPage).skip(warnsToSkip).exec();

    if (userInGuild.user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: Bots cannot have any warnings.***");
      return interaction.reply({ embeds: [embed], ephemeral: true });
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
        `***:warning: ${warn.username || warn.user.username
        } has no warnings.***`
      )
      .setColor("Red");
    if (userWarnings.length < 1)
      return interaction.reply({ embeds: [noWarnings] })


    let warns = warnsToSkip + 1;

    const previousButton = new ButtonBuilder()
      .setCustomId(`warnsBoard:previous:${warn.user.id || warn.id}:${page}`)
      .setLabel("⬅️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 1);

    const nextButton = new ButtonBuilder()
      .setCustomId(`warnsBoard:next:${warn.user.id || warn.id}:${page}`)
      .setLabel("➡️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(userWarnings.length < warnsPerPage);
      
    const row = new ActionRowBuilder().addComponents(
      previousButton,
      nextButton
    );

    if (interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      for (const warn of userWarnings) {
        warnsBoard += [
          `**warn ID:** ${warn._id}`,
          `**Date:** <t:${Math.round(warn.timestamp / 1000)}>`,
          `**Reason:** ${warn.reason}`,
        ].join("\n") + "\n\n";
        warns++;
      }

      const embed = new EmbedBuilder()
        .setTitle(`***${warn.username || warn.user.username}'s warnings***`)
        .setDescription(warnsBoard)
        .setColor("Yellow");
      interaction.reply({ embeds: [embed], components: [row] });
    } else {
      for (const warn of userWarnings) {
        warnsBoard += [
          `**Date:** <t:${Math.round(warn.timestamp / 1000)}>`,
          `**Reason:** ${warn.reason}`,
        ].join("\n") + "\n\n";
        warns++;
      }

      const embed = new EmbedBuilder()
        .setTitle(`***${warn.username || warn.user.username}'s warnings***`)
        .setDescription(warnsBoard)
        .setColor("Yellow")
        .setFooter({ text: "WarnID is hidden as the Command user is not a warn", iconURL: `${warn.avatarURL() || warn.user.avatarURL()}` })
      interaction.reply({ embeds: [embed], components: [row] });
    }
  },
};
