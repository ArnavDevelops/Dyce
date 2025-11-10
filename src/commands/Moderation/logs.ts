import {
  InteractionContextType,
  EmbedBuilder,
  ApplicationCommandOptionType,
  TextChannel,
} from "discord.js";
import messageLogSchema from "../../schemas/logSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "logs",
  description: "sets your log channel",
  contexts: [InteractionContextType.Guild],
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: "set",
      description: "set or replace your log channel",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "set the channel",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
    {
      name: "disable",
      description: "Disable the log channel",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;

    if (args.getSubcommand() === "set") {
      const channel = args.getChannel("channel");
      const data = await messageLogSchema.findOne({
        Guild: guild.id,
        Channel: channel.id,
      });
      if (data) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: You already had this channel set for logs***"
          );
        return await interaction.reply({
          embeds: [embed],
          flags: "Ephemeral",
        });
      }

      if (!data) {
        if (!channel || !(channel instanceof TextChannel)) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: Please select a valid text channel***"
            );
          return await interaction.reply({
            embeds: [embed],
            flags: "Ephemeral",
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
          .setDescription("***:white_check_mark: The logs channel was set***");
        await interaction.reply({ embeds: [embed3], flags: "Ephemeral" });
      }
    }


    else if (args.getSubcommand() === "disable") {
      try {
        await messageLogSchema.findOneAndDelete({ Guild: guild.id });
      } catch (err) {
        return;
      }

      const embed4 = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "***:white_check_mark: The logs channel has been disabled***"
        );
      return await interaction.reply({ embeds: [embed4], flags: "Ephemeral" });
    }
  },
});
