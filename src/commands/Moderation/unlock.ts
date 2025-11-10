import {
  NewsChannel,
  EmbedBuilder,
  TextChannel,
  InteractionContextType,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "unlock",
  description: "Unlocks a channel",
  defaultMemberPermissions: ["Administrator"],
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "channel",
      description: "Unlocks a channel",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "Select the channel",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild, member } = interaction;
    if (args.getSubcommand() === "channel") {
      const role = guild.roles.cache.find((r: any) => r.name === "@everyone");
      let channel = args.getChannel("channel");
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
      if (!channel) return (channel = interaction.channel);

      if (channel.permissionsFor(guild.id).has("SendMessages") === true) {
        const notlocked = new EmbedBuilder()
          .setDescription(`***:warning: ${channel} is not Locked.***`)
          .setColor("Red");
        return await interaction.reply({
          embeds: [notlocked],
          flags: ["Ephemeral"],
        });
      }

      await channel.permissionOverwrites.edit(guild.id, {
        SendMessages: null,
      });

      try {
        await channel.permissionOverwrites.edit(role, { SendMessages: null });
      } catch (err) {
        return;
      }

      const embed = new EmbedBuilder()
        .setDescription(`***:white_check_mark: ${channel} is now Unlocked.***`)
        .setColor("Red");
      return await interaction.reply({ embeds: [embed] });
    }
  },
});
