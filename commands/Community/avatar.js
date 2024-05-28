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
        .addStringOption((s) =>
          s
            .setName("type")
            .setDescription("Choose the type of avatar")
            .addChoices(
              { name: "Default Avatar", value: "default" },
              { name: "Server Avatar", value: "server" }
            )
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
      const type = options.getString("type")

      if (type == "default" || !type) {
        const avatar = user.avatarURL({ dynamic: true, size: 4096 });

        const button = new ButtonBuilder()
          .setLabel('Download')
          .setStyle(ButtonStyle.Link)
          .setURL(user.avatarURL({ size: 4096 }))

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
      } else if (type == "server") {
        let res = await fetch(`https://discord.com/api/guilds/${guild.id}/members/${user.id}`, {
          headers: {
            Authorization: `Bot ${client.token}`
          },
        })
        let data = await res.json()

        if (data.avatar !== undefined && data.avatar !== null) {
          let avatar = `https://cdn.discordapp.com/guilds/${guild.id}/users/${user.id}/avatars/${data.avatar}.webp?size=4096`

          const button = new ButtonBuilder()
            .setLabel('Download')
            .setStyle(ButtonStyle.Link)
            .setURL(avatar)

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
        } else {
          const avatar = user.avatarURL({ dynamic: true, size: 4096 });

          const button = new ButtonBuilder()
            .setLabel('Download')
            .setStyle(ButtonStyle.Link)
            .setURL(user.avatarURL({ size: 4096 }))

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
      }
    }

    //Guild
    if (options.getSubcommand() === "server") {
      const avatar = guild.iconURL({ dynamic: true, size: 4096 });

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
