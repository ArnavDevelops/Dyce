const {
  SlashCommandBuilder,
  EmbedBuilder,
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
      option.setName("guild").setDescription("Check avatar of the server.")
    ),
  async execute(interaction, client) {
    const { options, guild } = interaction;

    //User
    if (options.getSubcommand() === "user") {
      const user = options.getUser("user") || interaction.user;
      const avatar = user.avatarURL({ dynamic: true, size: 256 });

      const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Avatar`)
        .setImage(avatar)
        .setColor("Random")
      await interaction.reply({ embeds: [embed] });
    }

    //Guild
    if (options.getSubcommand() === "guild") {
      const avatar = guild.iconURL({ dynamic: true, size: 256 });

      const embed = new EmbedBuilder()
        .setTitle(`${guild.name}'s Avatar`)
        .setImage(avatar)
        .setColor("Random");
      await interaction.reply({ embeds: [embed] });
    }
  },
};
