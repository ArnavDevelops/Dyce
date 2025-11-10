import {
  EmbedBuilder,
  ApplicationCommandOptionType,
  InteractionContextType,
  TextChannel,
  NewsChannel,
} from "discord.js";

import { Command } from "../../structures/Command";

export default new Command({
  name: "slowmode",
  description: "Sets a slowmode",
  options: [
    {
      name: "channel",
      description: "Select the channel",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "duration",
      description: "Set the duration (in seconds)",
      type: ApplicationCommandOptionType.Number,
      max_value: 21600,
      required: true,
    },
  ],
  defaultMemberPermissions: ["Administrator"],
  contexts: [InteractionContextType.Guild],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;

    let content = ``;
    let durationContent = "";
    const channel = guild.channels.cache.get(args.getChannel("channel").id);
    if (
      !channel ||
      !(channel instanceof TextChannel || channel instanceof NewsChannel)
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:warning: Please select a valid text channel***");
      return await interaction.reply({
        embeds: [embed],
        flags: "Ephemeral",
      });
    }

    const duration = args.getNumber("duration");

    if (duration >= 3600) {
      durationContent += `${Math.floor(duration / 3600)} hour(s)`;
    } else if (duration >= 60) {
      durationContent += `${Math.floor((duration % 3600) / 60)} minute(s)`;
    } else if (duration <= 60) {
      durationContent += `${duration} second(s)`;
    }

    if (channel.rateLimitPerUser == duration) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `***:warning: The channel (#${channel.name}) already has ${durationContent} of slowmode. Choose a different number.***`
        );
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    } else {
      if (duration == 0) {
        content += `***:white_check_mark: The channel (#${channel.name}) now has no duration at all.***`;
      } else if (duration >= 0) {
        content += `***:white_check_mark: The channel (#${channel.name}) now has ${durationContent} of slowmode***`;
      }

      try {
        channel.setRateLimitPerUser(duration);

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setDescription(content);
        return await interaction.reply({ embeds: [embed] });
      } catch (err) {
        return;
      }
    }
  },
});
