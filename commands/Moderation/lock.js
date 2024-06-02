const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription(
      "Locks a channel."
    )
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("channel")
        .setDescription("Lock a channel")
        .addChannelOption((channel) =>
          channel
            .setName("channel")
            .setDescription("Select the channel you wanna lock.")
            .setRequired(true)
        )
        .addStringOption((reason) =>
          reason.setName("reason").setDescription("Give a reason.")
        )
    ),
  async execute(interaction, client) {
    const { member, options, guild } = interaction;

    if (options.getSubcommand() === "channel") {
      const role = guild.roles.cache.find((r) => r.name === "@everyone");
      const channel = options.getChannel("channel");
      const reason = options.getString("reason") || "No reason given";
      if (!channel) channel = interaction.channel;

      const permission = member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      );

      const permissionEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "***:warning: You don't have the permission `Manage Messages` to use this Command.***"
        );
      if (!permission)
        return interaction.reply({
          embeds: [permissionEmbed],
          ephemeral: true,
        });

      if (channel.permissionsFor(guild.id).has("SendMessages") === false) {
        const alreadyLocked = new EmbedBuilder()
          .setDescription(`***:warning: ${channel} is already locked.***`)
          .setColor("Red");
        return interaction.reply({ embeds: [alreadyLocked], ephemeral: true });
      }

      await channel.permissionOverwrites.edit(guild.id, {
        SendMessages: false,
      });

      await channel.permissionOverwrites.edit(role, { SendMessages: false });

      const embed = new EmbedBuilder()
        .setDescription(`***:x: ${channel} is now Locked***`)
        .setColor("Red")
        .addFields({ name: "Reason", value: `${reason}` });
      interaction.reply({ embeds: [embed] });
    }
  },
};
