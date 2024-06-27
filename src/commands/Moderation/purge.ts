//Imports
import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";

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
        .addStringOption((option) =>
          option
            .setName("till")
            .setDescription("Till which message? Paste the message Link or the message ID.")
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
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction: any, client: any) {
    const { options, channel } = interaction;

    //Any subcommand
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

    //After subcommand
    else if (options.getSubcommand() === "after") {
      const messagelink = options.getString("message");
      const tillMsgLink = options.getString("till");

      const badEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:warning: Invalid ID/Link***");
      const badEmbed2 = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:warning: No after message found***");
      const badEmbed21 = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:warning: No before message found***")


      //Regex code to make sure messagelink matches either link or ID
      let messageId = (messagelink.match(/\d{10,}/g) || []).pop();
      let beforeMsgId = (tillMsgLink.match(/\d{10,}/g) || []).pop();
      if (!messageId || !beforeMsgId)
        return interaction.reply({ embeds: [badEmbed], ephemeral: true });

      let referencedMessage = await channel.messages
        .fetch(messageId)
        .catch((err: Error) => {
          return;
        });
      if (!referencedMessage) {
        return await interaction.reply({ embeds: [badEmbed2], ephemeral: true });
      }

      let beforeReferencedMessage = await channel.messages
        .fetch(beforeMsgId)
        .catch((err: Error) => {
          return;
        });
      if (!beforeReferencedMessage) {
        return await interaction.reply({ embeds: [badEmbed21], ephemeral: true });
      }

      await interaction.deferReply({ ephemeral: true });

      try {
        if (tillMsgLink) {
          if (referencedMessage.createdAt > beforeReferencedMessage.createdAt || referencedMessage.id == beforeReferencedMessage.id) {
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `***:warning: The "till" message must not be older then the original message***`
              );
            return await interaction.followUp({ embeds: [embed], ephemeral: true });
          } else {
            let messages = await channel.messages.fetch({
              before: beforeReferencedMessage.id,
              after: referencedMessage.id,
              limit: 100,
            })
            if (messages.size === 100) {
              const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("***:warning: You cannot delete more than 100 messages due to the Discord API limiting it to 100. Sorry for inconvience.")
              return await interaction.reply({ embeds: [embed], epheremal: true })
            } else {

              let messagesToDeleteFiltered = messages.filter(
                (msg: any) => !msg.pinned && !msg.system && !msg.deleted
              );

              for (const messages of messagesToDeleteFiltered.values()) {
                const ageInMs = Date.now() - messages.createdAt.getTime();
                const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
                //If message is older then 2 weeks
                if (ageInDays > 14) {
                  const DaysEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(
                      "***:warning: You cannot delete messages older than 14 days or 2 weeks!***"
                    );

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
                return await interaction.followUp({ embeds: [embed], ephemeral: true });
              }

              const amount = await channel.bulkDelete(messagesToDeleteFiltered);
              const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  `***:white_check_mark: Purged ${amount.size} messages.***`
                );
              return await interaction.followUp({ embeds: [embed], ephemeral: true });
            }
          }




          //If till option is null/undefined
        } else if (!tillMsgLink) {
          let messages = await channel.messages.fetch({
            after: referencedMessage.id,
            limit: 100,
          });
          let messagesToDeleteFiltered = messages.filter(
            (msg: any) => !msg.pinned && !msg.system && !msg.deleted
          );

          if (messages.size === 100) {
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription("***:warning: You cannot delete more than 100 messages due to the Discord API limiting it to 100. Sorry for inconvience.")
            return await interaction.reply({ embeds: [embed], epheremal: true })
          } else {
            for (const messages of messagesToDeleteFiltered.values()) {
              const ageInMs = Date.now() - messages.createdAt.getTime();
              const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
              //If message is older then 2 weeks
              if (ageInDays > 14) {
                const DaysEmbed = new EmbedBuilder()
                  .setColor("Red")
                  .setDescription(
                    "***:warning: You cannot delete messages older than 14 days or 2 weeks!***"
                  );

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
              return await interaction.followUp({ embeds: [embed], ephemeral: true });
            }

            const amount = await channel.bulkDelete(messagesToDeleteFiltered);
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `***:white_check_mark: Purged ${amount.size} messages.***`
              );
            return await interaction.followUp({ embeds: [embed], ephemeral: true });
          }
        }
      } catch (err) {
        return;
      }
    }
  },
};
