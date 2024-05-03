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
        .setCustomId(`member_roles-${user.id}`)
        .setLabel("View Roles")
        .setEmoji("💁")
        .setStyle(ButtonStyle.Primary);

        const button2 = new ButtonBuilder()
        .setCustomId(`badges-${user.id}`)
        .setLabel("View Badges")
        .setEmoji("🔰")
        .setStyle(ButtonStyle.Secondary);
      const row = new ActionRowBuilder().addComponents(button, button2);

      let status =
        member.presence?.status || user.presence?.status || "<:invisible_offline_blank:1234893868562907259> Offline/Invisible"
      if (status === "dnd") {
        status = "<:dnd_blank:1234902957129072741> Do not Disturb";
      }
      if (status === "idle") {
        status = "<:Idle:1234902778472824877> Idle";
      }
      if (status === "online") {
        status = "<:online_blank:1234902595940778045> Online";
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
