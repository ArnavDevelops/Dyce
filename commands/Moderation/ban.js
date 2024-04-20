const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a specific user.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user
        .setName("user")
        .setDescription(
          "Select the user you want to ban, you can also use someone's Id."
        )
        .setRequired(true)
    )
    .addStringOption((reason) =>
      reason
        .setName("reason")
        .setDescription("Provide a reason for it.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("appealable")
        .setDescription("Whether or not the ban is appealable.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("delete_messages")
        .setDescription("Delete messages?")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const { member, options } = interaction;
    const banUser = options.getUser("user") || options.getUser("user").id;
    const banMember = await interaction.guild.members
      .fetch(banUser)
      .catch(async (err) => {
        const failEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: There was an error banning the user, please make sure that the user is in the server.***"
          );
        await interaction.reply({ embeds: [failEmbed], ephemeral: true });
        return null;
      });
    if (!banMember) return;

    const reason = options.getString("reason");
    const appealable = options.getBoolean("appealable");
    const deletemsgs = options.getBoolean("delete_messages");
    let guild = await interaction.guild.fetch();

    const permission = member.permissions.has(
      PermissionsBitField.Flags.BanMembers
    );

    const permissionEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "***:warning: You don't have the permission `Ban Members` to use this Command.***"
      );
    if (!permission)
      return await interaction.reply({
        embeds: [permissionEmbed],
        ephemeral: true,
      });

    if (banMember.id == member.id) {
      const cannotbanyourself = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You can't ban yourself.***");
      return await interaction.reply({
        embeds: [cannotbanyourself],
        ephemeral: true,
      });
    }

    if (banMember.user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You cannot ban bots.***");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (banMember.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      const cannotbanMods = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: I can't ban Moderators and Above.***");
      return await interaction.reply({
        embeds: [cannotbanMods],
        ephemeral: true,
      });
    }
    try {
      if (appealable == true) {
        const dmEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `🚫 You have been banned from **${guild.name}** by ${member.user.username}`
          )
          .addFields({
            name: "Reason",
            value: `${reason}`,
          })
          .addFields({
            name: "Appeal on",
            value: `https://forms.gle/buys3akBo6MtTXCg6`,
          });
        await banMember.send({ embeds: [dmEmbed] }).catch((err) => {
          return;
        });

        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `:white_check_mark: Successfully Banned ***${banUser.username}*** with appeal`
          )
          .addFields({
            name: "Reason",
            value: `${reason}`,
          });
        await interaction.reply({ embeds: [embed] });

        await banMember.ban({ reason: reason }).catch((err) => {
          return;
        });
      } else if (appealable == false) {
        const dmEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `🚫 You have been banned from ***${guild.name}*** by ${member.user.username} and it is **not appealable**`
          )
          .addFields({
            name: "Reason",
            value: `${reason}`,
          });
        await banMember.send({ embeds: [dmEmbed] }).catch((err) => {
          return;
        });

        const embed2 = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `:white_check_mark: Successfully Banned ***${banUser.username}*** without appeal`
          )
          .addFields({
            name: "Reason",
            value: `${reason}`,
          });
        await interaction.reply({ embeds: [embed2] });

        return await banMember.ban({ reason: reason }).catch((err) => {
          return;
        });
      }
      if (deletemsgs == true) {
        await banMember.ban({ reason: reason, days: 7 }).catch((err) => {
          return;
        });

        const messages = await interaction.channel.messages.fetch({
          limit: 100,
          before: interaction.id,
        });

        const userMessages = messages.filter(
          (m) => m.author.id === banMember.user.id
        );
        return await interaction.channel.bulkDelete(userMessages, true);
      }
    } catch (err) {
      return;
    }
  },
};
