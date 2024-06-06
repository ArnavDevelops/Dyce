//Imports
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField
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
        .setName("delete_messages")
        .setDescription("Delete messages?")
        .setRequired(false)
    )
    .addStringOption((reason) =>
      reason
        .setName("note")
        .setDescription("Any notes for this action?.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction, client) {
    const { options, guild } = interaction;

    //Variables
    const user = options.getUser("user") || options.getUser("user").id;
    const member = await guild.members.fetch(user.id).catch((err) => { return })
    const reason = options.getString("reason");
    const deletemsgs = options.getBoolean("delete_messages") || false;

    if (user.id == interaction.user.id) {
      const cannotbanyourself = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You can't ban yourself.***");
      return await interaction.reply({
        embeds: [cannotbanyourself],
        ephemeral: true,
      });
    }

    if (user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You cannot ban bots.***");
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (member) {
      if (member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        const cannotbanMods = new EmbedBuilder()
          .setColor("Red")
          .setDescription("***:x: I can't ban Moderators and Above.***");
        return await interaction.reply({
          embeds: [cannotbanMods],
          ephemeral: true,
        });
      }
    }

    //Main part of the ban command
    try {
      if (deletemsgs == false) {
        const dmEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `🚫 You have been banned from ***${guild.name}*** by ${interaction.user.username}`
          )
          .addFields({
            name: "Reason",
            value: `${reason}`,
          });
        await user.send({ embeds: [dmEmbed] }).catch((err) => {
          return;
        });

        const embed2 = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `:white_check_mark: Successfully Banned ***${user.username}***`
          )
          .addFields({
            name: "Reason",
            value: `${reason}`,
          });
        await interaction.reply({ embeds: [embed2] });
        return await guild.bans.create(user.id, { reason: reason }).catch((err) => {
          return;
        });
      } else if (deletemsgs == true) {
        await guild.bans.create(user.id, { reason: reason, deleteMessageDays: 7 }).catch((err) => {
          return;
        });

        const messages = await interaction.channel.messages.fetch({
          limit: 100,
          before: interaction.id,
        });

        const userMessages = messages.filter(
          (m) => m.author.id === user.id
        );

        return await interaction.channel.bulkDelete(userMessages, true);

      //If there should be a note regarding the action
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
