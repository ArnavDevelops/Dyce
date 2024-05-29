const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const modNotesSchema = require("../../schemas/modNotesSchema.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user
        .setName("user")
        .setDescription(
          "Select the user you want to ban, you can also use user Id."
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
    )
    .addStringOption((reason) =>
      reason
        .setName("note")
        .setDescription("Any notes for this action?.")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const { options } = interaction;
    const user = options.getUser("user") || options.getUser("user").id;
    const member = await interaction.guild.members
      .fetch(user)
      .catch(async (err) => {
        const failEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: There was an error banning the user, please make sure that the user is in the server.***"
          );
        await interaction.reply({ embeds: [failEmbed], ephemeral: true });
        return null;
      });
    if (!member) return;

    const reason = options.getString("reason");
    const appealable = options.getBoolean("appealable");
    const deletemsgs = options.getBoolean("delete_messages") || false;
    let guild = await interaction.guild.fetch();

    const permission = interaction.member.permissions.has(
      PermissionsBitField.Flags.BanMembers || PermissionsBitField.Flags.Administrator
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

    if (member.id == interaction.user.id) {
      const cannotbanyourself = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You can't ban yourself.***");
      return await interaction.reply({
        embeds: [cannotbanyourself],
        ephemeral: true,
      });
    }

    if (member.user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You cannot ban bots.***");
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
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
            `🚫 You have been banned from **${guild.name}** by ${interaction.user.username}`
          )
          .addFields({
            name: "Reason",
            value: `${reason}`,
          })
          .addFields({
            name: "Appeal on",
            value: `https://forms.gle/buys3akBo6MtTXCg6`,
          });
        await member.send({ embeds: [dmEmbed] }).catch((err) => {
          return;
        });

        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `:white_check_mark: Successfully Banned ***${user.username}*** with appeal`
          )
          .addFields({
            name: "Reason",
            value: `${reason}`,
          });
        await interaction.reply({ embeds: [embed] });

        await member.ban({ reason: reason }).catch((err) => {
          return;
        });
      } else if (appealable == false) {
        const dmEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `🚫 You have been banned from ***${guild.name}*** by ${interaction.user.username} and it is **not appealable**`
          )
          .addFields({
            name: "Reason",
            value: `${reason}`,
          });
        await member.send({ embeds: [dmEmbed] }).catch((err) => {
          return;
        });

        const embed2 = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `:white_check_mark: Successfully Banned ***${user.username}*** without appeal`
          )
          .addFields({
            name: "Reason",
            value: `${reason}`,
          });
        await interaction.reply({ embeds: [embed2] });

        return await member.ban({ reason: reason }).catch((err) => {
          return;
        });
      } else if (deletemsgs == true) {
        await member.ban({ reason: reason, days: 7 }).catch((err) => {
          return;
        });

        const messages = await interaction.channel.messages.fetch({
          limit: 100,
          before: interaction.id,
        });

        const userMessages = messages.filter(
          (m) => m.author.id === member.user.id
        );

        return await interaction.channel.bulkDelete(userMessages, true);
      } else if (note) {
        await new modNotesSchema({
          guildId: guild.id,
          moderatorId: interaction.user.id,
          command: "/ban",
          date: Date.now(),
          note: `Moderated: ${member.user.username} | **${note}**`
        }).save()
      }
    } catch (err) {
      return;
    }
  },
};
