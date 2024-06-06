//Imports
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlocks channel.")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("channel")
        .setDescription("Unlocks a locked channel.")
        .addChannelOption((channel) =>
          channel
            .setName("channel")
            .setDescription("Select the channel you wanna unlock.")
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const { options, guild, member } = interaction;
    if (options.getSubcommand() === "channel") {
      const role = guild.roles.cache.find((r) => r.name === "@everyone");
      const channel = options.getChannel("channel");
      if (!channel) channel = interaction.channel;

      if (channel.permissionsFor(guild.id).has("SendMessages") === true) {
        const notlocked = new EmbedBuilder()
          .setDescription(`***:warning: ${channel} is not Locked.***`)
          .setColor("Red");
        return await interaction.reply({ embeds: [notlocked], ephemeral: true });
      }

      await channel.permissionOverwrites.edit(guild.id, {
        SendMessages: null,
      });

      try {
        await channel.permissionOverwrites.edit(role, { SendMessages: null });
      } catch(err) {
        return;
      }

      const embed = new EmbedBuilder()
        .setDescription(`***:white_check_mark: ${channel} is now Unlocked.***`)
        .setColor("Red");
      return await interaction.reply({ embeds: [embed] });
    }
  },
};
