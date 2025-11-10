import {
  EmbedBuilder,
  ChannelType,
  InteractionContextType,
  ApplicationCommandOptionType,
  NewsChannel,
} from "discord.js";
import autoPublishSchema from "../../schemas/autoPublishSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "autopublish",
  description: "Auto-publishes your announcements to other servers",
  contexts: [InteractionContextType.Guild],
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: "add",
      description: "The channel that needs autopublishing",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "select the Channel",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "The channel that no longer needs autopublishing",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "select the Channel",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;

    if (args.getSubcommand() === "add") {
      const channel = guild.channels.cache.get(args.getChannel("channel").id);
      if (!channel || channel instanceof NewsChannel) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("***:warning: Please select a valid text channel***");
        return await interaction.reply({
          embeds: [embed],
          flags: "Ephemeral",
        });
      }

      const data = await autoPublishSchema.findOne({
        guildId: guild.id,
        channelId: channel.id,
      });

      if (!data) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `***:white_check_mark: Successfully selected ${channel.name} for autopublishing.***`
          )
          .setFooter({
            text: "Tip: use a period/full stop punctuation at the start of your message to prevent autopublish.",
            iconURL:
              "https://cdn.discordapp.com/emojis/1233294833389539390.webp?size=128&quality=lossless",
          });
        await interaction.reply({ embeds: [embed], flags: "Ephemeral" });

        try {
          new autoPublishSchema({
            guildId: guild.id,
            channelId: channel.id,
          }).save();
        } catch (err) {
          return;
        }
      } else {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: This channel is already setup for autopublishing.***"
          );
        return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
      }
    } else if (args.getSubcommand() == "remove") {
      const channel = guild.channels.cache.get(args.getChannel("channel").id);
      if (channel.type !== ChannelType.GuildAnnouncement) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: The channel you selected is not an Announcement channel.***"
          );
        return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
      }

      const data = await autoPublishSchema.findOne({
        guildId: guild.id,
        channelId: channel.id,
      });

      if (!data) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***The channel you selected has not been setup for autopublishing.***"
          );
        return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
      } else {
        const embed = new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `***:white_check_mark: Successfully removed ${channel.name} for autopublishing.***`
          );
        interaction.reply({ embeds: [embed], flags: "Ephemeral" });

        try {
          await autoPublishSchema.findOneAndDelete({
            guildId: guild.id,
            channelId: channel.id,
          });
        } catch (err) {
          return;
        }
      }
    }
  },
});
