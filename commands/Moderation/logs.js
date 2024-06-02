const {
  PermissionsBitField,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const messageLogSchema = require("../../schemas/logSchema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Set the message log channel for the server.")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set the message log channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "Specify the channel to be the message log channel."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable the message log channel.")
    ),
  async execute(interaction, client) {
    const { member, guild } = interaction;

    const permission = member.permissions.has(
      PermissionsBitField.Flags.Administrator
    );

    const permissionEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "***:warning: You don't have the permission `Administrator` to use this Command.***"
      );
    if (!permission)
      return interaction.reply({
        embeds: [permissionEmbed],
        ephemeral: true,
      });

    const subcommand = interaction.options.getSubcommand();

    //Set
    if (subcommand === "set") {
      const channel = interaction.options.getChannel("channel");

      if (!channel) {
        return await interaction.editReply({
          content: "Please select a valid text channel.",
          components: [],
          embeds: [],
        });
      }

      try {
        await messageLogSchema.findOneAndUpdate(
          { Guild: guild.id },
          { Guild: guild.id, Channel: channel.id },
          { upsert: true }
        );
      } catch (err) {
        return;
      }

      const embed3 = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Done")
        .setDescription("The logs channel was set");
      await interaction.reply({ embeds: [embed3] });
    }

    //Disable
    else if (subcommand === "disable") {
      try {
        await messageLogSchema.findOneAndDelete({ Guild: guild.id });
      } catch (err) {
        return;
      }

      const embed4 = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Done")
        .setDescription("The logs channel was disabled");

      await interaction.reply({ embeds: [embed4] });
    }
  },
};
