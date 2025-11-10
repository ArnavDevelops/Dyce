import {
  EmbedBuilder,
  InteractionContextType,
  ApplicationCommandOptionType,
  TextChannel,
  NewsChannel,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "lock",
  description: "Locks a channel",
  defaultMemberPermissions: ["Administrator"],
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "channel",
      description: "Locks a channel",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "Select the channel",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
        {
          name: "reason",
          description: "The reason",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;

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
      const reason = args.getString("reason") || "No reason given";
      if (!channel) {
        return (channel = interaction.channel);
      }

      if (channel.permissionsFor(guild.id).has("SendMessages") === false) {
        const alreadyLocked = new EmbedBuilder()
          .setDescription(`***:warning: ${channel} is already locked.***`)
          .setColor("Red");
        return interaction.reply({ embeds: [alreadyLocked], flags: ["Ephemeral"] });
      }

      await channel.permissionOverwrites.edit(guild.id, {
        SendMessages: false,
      });

      await channel.permissionOverwrites.edit(role, { SendMessages: false });

      const embed = new EmbedBuilder()
        .setDescription(`***:x: ${channel} is now Locked***`)
        .setColor("Red")
        .addFields({ name: "Reason", value: `${reason}` });
      return await interaction.reply({ embeds: [embed] });
    }
  },
});
