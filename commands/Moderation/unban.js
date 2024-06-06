//Imports
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
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
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction, client) {
    const { options, guild, member } = interaction;

    //Variables
    const user = options.getUser("user");
    const reason = options.getString("reason");

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

        await guild.bans.remove(user, reason).catch(async(err) => {
          const cantunbanthisUser = new EmbedBuilder()
            .setColor("Red")
            .setDescription("***:warning: I cannot unban this user.***");
          return await interaction.reply({
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
      return await interaction.reply({ embeds: [ubEmbed] });
    } catch (err) {
      return;
    }
  },
};
