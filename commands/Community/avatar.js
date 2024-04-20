const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Check avatar of a specific user or the server.")
    .setDMPermission(false)
    .addSubcommand((option) =>
      option
        .setName("user")
        .setDescription("Check avatar of a user.")
        .addUserOption((user) =>
          user
            .setName("user")
            .setDescription("Select a user")
            .setRequired(false)
        )
    )
    .addSubcommand((option) =>
      option.setName("server").setDescription("Check avatar of the server.")
    ),
  async execute(interaction, client) {
    const { options, guild } = interaction;

    //User
    if (options.getSubcommand() === "user") {
      const user = options.getUser("user") || interaction.user;
      const avatar = user.avatarURL({ dynamic: true, size: 256 });

      const button = new ButtonBuilder()
        .setLabel('Download')
        .setStyle(ButtonStyle.Link)
        .setURL(user.avatarURL())

      const button2 = new ButtonBuilder()
        .setCustomId('tryuserinfo')
        .setLabel('Try /userinfo too!')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)
      const row = new ActionRowBuilder().addComponents(button, button2)

      const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Avatar`)
        .setImage(avatar)
        .setColor("Random")
      await interaction.reply({ embeds: [embed], components: [row] });
    }

    //Guild
    if (options.getSubcommand() === "server") {
      const avatar = guild.iconURL({ dynamic: true, size: 256 });

      const button = new ButtonBuilder()
      .setLabel('Download')
      .setStyle(ButtonStyle.Link)
      .setURL(guild.iconURL())

    const button2 = new ButtonBuilder()
      .setCustomId('trrguildinfo')
      .setLabel('Try /serverinfo too!')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
    const row = new ActionRowBuilder().addComponents(button, button2)

      const embed = new EmbedBuilder()
        .setTitle(`${guild.name}'s Avatar`)
        .setImage(avatar)
        .setColor("Random");
      await interaction.reply({ embeds: [embed], components: [row] });
    }
  },
};
