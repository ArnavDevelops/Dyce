//Imports
import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import messageLogSchema from "../../schemas/logSchema"

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
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: any, client: any) {
    const { guild, options } = interaction;

    //Set
    if (options.getSubcommand() === "set") {
      const channel = options.getChannel("channel");

      if (!channel) {
        return await interaction.editReply({
          content: "Please select a valid text channel.",
          components: [],
          embeds: [],
        });
      }

      //Channel being set as the log channel
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
        .setDescription("***:white_check_mark: The logs channel was set***");
      await interaction.reply({ embeds: [embed3] });
    }

    //Disable
    else if (options.getSubcommand() === "disable") {
      //Deleting the log channel from the database
      try {
        await messageLogSchema.findOneAndDelete({ Guild: guild.id });
      } catch (err) {
        return;
      }

      const embed4 = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:white_check_mark: The logs channel has been disabled***");
      return await interaction.reply({ embeds: [embed4] });
    }
  },
};
