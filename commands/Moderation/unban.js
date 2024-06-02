const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a specific user.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user.setName("user").setDescription("Select the user.").setRequired(true)
    )
    .addStringOption((reason) =>
      reason
        .setName("reason")
        .setDescription("Provide a reason for it.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { options, guild, member } = interaction;
    const user = options.getUser("user");
    const reason = options.getString("reason");

    const permission = member.permissions.has(
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

    try {
      await guild.bans.fetch().then(async (bans) => {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("***:x: there is no one banned in this Server.***");
        if (bans.size === 0)
          return await interaction.reply({ embeds: [embed], ephemeral: true });

        let bannedID = bans.find((ban) => ban.user.id == user);
        const embed1 = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: This user is not banned in this Server.***"
          );
        if (!bannedID)
          return await interaction.reply({ embeds: [embed1], ephemeral: true });

        await guild.bans.remove(user, reason).catch((err) => {
          const cantunbanthisUser = new EmbedBuilder()
            .setColor("Red")
            .setDescription("***:warning: I cannot unban this user.***");
          return interaction.reply({
            embeds: [cantunbanthisUser],
            ephemeral: true,
          });
        });
      });
      const ubEmbed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `***:white_check_mark: Successfully unbanned ${user.username} (${user.id}) || reason: ${reason}***`
        );
      await interaction.reply({ embeds: [ubEmbed] });
    } catch (err) {
      return;
    }
  },
};
