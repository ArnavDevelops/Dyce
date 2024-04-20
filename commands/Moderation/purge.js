const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Deletes messages.")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("after")
        .setDescription(
          "Deletes the messages after a specified Message using the message link or the message ID."
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Paste the message Link or the message ID.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("any")
        .setDescription("Deletes the given amount of messages.")
        .addIntegerOption((number) =>
          number
            .setName("amount")
            .setDescription("Mention the number of messages to be deleted.")
            .setMinValue(5)
            .setMaxValue(50)
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const { member, options, channel } = interaction;

    const permission = member.permissions.has(
      PermissionsBitField.Flags.ManageMessages
    );

    const permissionEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "***:warning: You don't have the permission `Manage Messages` to use this Command.***"
      );
    if (!permission)
      return interaction.reply({ embeds: [permissionEmbed], ephemeral: true });

    //Any
    if (options.getSubcommand() === "any") {
      await interaction.deferReply({ ephemeral: true });

      let number = options.getInteger("amount");

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `***:white_check_mark: Purged ${number} of messages.***`
        );

      const DaysEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(
          ":x: ***You cannot delete messages older than 14 days or 2 weeks!***"
        );

      try {
        await channel.bulkDelete(number);
        await interaction.followUp({ embeds: [embed], ephemeral: true });
      } catch (err) {
        await interaction.followUp({ embeds: [DaysEmbed], ephemeral: true });
      }
    }

    //After
    else if (options.getSubcommand() === "after") {
      const messagelink = options.getString("message");
      const limit = options.getInteger("limit");
      const badEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: Invalid ID/Link***");
      const badEmbed2 = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: No message Found***");

      let messageId = (messagelink.match(/\d{10,}/g) || []).pop();
      if (!messageId)
        return interaction.reply({ embeds: [badEmbed], ephemeral: true });

      let referencedMessage = await channel.messages
        .fetch(messageId)
        .catch((err) => {
          return;
        });
      if (!referencedMessage)
        return interaction.reply({ embeds: [badEmbed2], ephemeral: true });

      await interaction.deferReply({ ephemeral: true });
      const DaysEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "***:warning: You cannot delete messages older than 14 days or 2 weeks!***"
        );
      try {
        let messages = await channel.messages.fetch({
          limit: limit,
          after: referencedMessage.id,
        });
        let messagesToDeleteFiltered = messages.filter(
          (msg) => !msg.pinned && !msg.system && !msg.deleted
        );

        for (const message of messagesToDeleteFiltered.values()) {
          const ageInMs = Date.now() - message.createdAt.getTime();
          const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
          if (ageInDays > 14) {
            return await interaction.followUp({
              embeds: [DaysEmbed],
              ephemeral: true,
            });
          }
        }

        if (messagesToDeleteFiltered.size === 0) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("***No messages to delete.***");
          return interaction.followUp({ embeds: [embed], ephemeral: true });
        }

        const amount = await channel.bulkDelete(messagesToDeleteFiltered);
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `***:white_check_mark: Purged ${amount.size} messages.***`
          );
        await interaction.followUp({ embeds: [embed], ephemeral: true });
      } catch (err) {
        return;
      }
    }
  },
};
