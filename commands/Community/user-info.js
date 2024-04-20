const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Check the information about a specific user.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user.setName("user").setDescription("Select the user.")
    ),
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const user = options.getUser("user") || interaction.user;
    const member = await guild.members.fetch(user);
    const username = user.username;
    const avatar = user.avatarURL();
    const joined = member.joinedAt;
    const created = user.createdAt;

      const button = new ButtonBuilder()
        .setCustomId("member_roles")
        .setLabel("View Roles")
        .setStyle(ButtonStyle.Primary);
      const row = new ActionRowBuilder().addComponents(button);

      let status =
        member.presence?.status || user.presence?.status || "Invisible";
      if (status === "dnd") {
        status = "🔴 Do not Disturb";
      }
      if (status === "idle") {
        status = "🟡 Idle";
      }
      if (status === "online") {
        status = "🟢 Online";
      }

      const embed = new EmbedBuilder()
        .setTitle("User Information")
        .addFields({ name: "Username", value: `${username}`, inline: true })
        .addFields({ name: "User ID", value: `${user.id}`, inline: true })
        .addFields({ name: "Status", value: `${status}` })
        .addFields({
          name: "Joined Server on",
          value: `<t:${Math.floor(joined / 1000)}:F>`,
        })
        .addFields({
          name: "Joined Discord on",
          value: `<t:${Math.floor(created / 1000)}:F>`,
        })
        .setThumbnail(avatar)
        .setColor("Random");
      await interaction.reply({ embeds: [embed], components: [row] });
  },
};
