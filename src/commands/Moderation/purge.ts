import {
  EmbedBuilder,
  InteractionContextType,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "purge",
  description: "Deletes messages",
  defaultMemberPermissions: ["ManageMessages"],
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "after",
      description: "Removes messages after a provided message",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "message",
          description: "The ID/link of the message",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "till",
          description: "Till where? also needs ID/link of a message",
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
    {
      name: "any",
      description: "Deletes a number of messages",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "amount",
          description: "The amount of messages to be deleted",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 5,
          max_value: 50,
        },
      ],
    },
  ],
  run: async ({ interaction, args }) => {
    const { channel } = interaction;

    if (args.getSubcommand() === "any") {
      await interaction.deferReply({ flags: ["Ephemeral"] });

      let number = args.getInteger("amount");

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
        await interaction.followUp({ embeds: [embed], flags: ["Ephemeral"] });
      } catch (err) {
        await interaction.followUp({
          embeds: [DaysEmbed],
          flags: ["Ephemeral"],
        });
      }
    } else if (args.getSubcommand() === "after") {
      const messagelink = args.getString("message");
      const tillMsgLink = args.getString("till");

      const badEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:warning: Invalid ID/Link***");
      const badEmbed2 = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:warning: No after message found***");
      const badEmbed21 = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:warning: No before message found***");

      let messageId = (messagelink.match(/\d{10,}/g) || []).pop();
      let beforeMsgId = (tillMsgLink.match(/\d{10,}/g) || []).pop();
      if (!messageId || !beforeMsgId)
        return interaction.reply({ embeds: [badEmbed], flags: ["Ephemeral"] });

      let referencedMessage = await channel.messages
        .fetch(messageId)
        .catch((err: Error) => {
          return;
        });
      if (!referencedMessage) {
        return await interaction.reply({
          embeds: [badEmbed2],
          flags: ["Ephemeral"],
        });
      }

      let beforeReferencedMessage = await channel.messages
        .fetch(beforeMsgId)
        .catch((err: Error) => {
          return;
        });
      if (!beforeReferencedMessage) {
        return await interaction.reply({
          embeds: [badEmbed21],
          flags: ["Ephemeral"],
        });
      }

      await interaction.deferReply({ flags: ["Ephemeral"] });

      try {
        if (tillMsgLink) {
          if (
            referencedMessage.createdAt > beforeReferencedMessage.createdAt ||
            referencedMessage.id == beforeReferencedMessage.id
          ) {
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `***:warning: The "till" message must not be older then the original message***`
              );
            return await interaction.followUp({
              embeds: [embed],
              flags: ["Ephemeral"],
            });
          } else {
            let messages = await channel.messages.fetch({
              before: beforeReferencedMessage.id,
              after: referencedMessage.id,
              limit: 100,
            });
            if (messages.size === 100) {
              const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  "***:warning: You cannot delete more than 100 messages due to the Discord API limiting it to 100. Sorry for inconvience."
                );
              return await interaction.reply({
                embeds: [embed],
                flags: ["Ephemeral"],
              });
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
                    flags: ["Ephemeral"],
                  });
                }
              }

              if (messagesToDeleteFiltered.size === 0) {
                const embed = new EmbedBuilder()
                  .setColor("Red")
                  .setDescription("***No messages to delete.***");
                return await interaction.followUp({
                  embeds: [embed],
                  flags: ["Ephemeral"],
                });
              }

              const amount = await channel.bulkDelete(messagesToDeleteFiltered);
              const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  `***:white_check_mark: Purged ${amount.size} messages.***`
                );
              return await interaction.followUp({
                embeds: [embed],
                flags: ["Ephemeral"],
              });
            }
          }
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
              .setDescription(
                "***:warning: You cannot delete more than 100 messages due to the Discord API limiting it to 100. Sorry for inconvience."
              );
            return await interaction.reply({
              embeds: [embed],
              flags: ["Ephemeral"],
            });
          } else {
            for (const messages of messagesToDeleteFiltered.values()) {
              const ageInMs = Date.now() - messages.createdAt.getTime();
              const ageInDays = ageInMs / (1000 * 60 * 60 * 24);

              if (ageInDays > 14) {
                const DaysEmbed = new EmbedBuilder()
                  .setColor("Red")
                  .setDescription(
                    "***:warning: You cannot delete messages older than 14 days or 2 weeks!***"
                  );

                return await interaction.followUp({
                  embeds: [DaysEmbed],
                  flags: ["Ephemeral"],
                });
              }
            }
            if (messagesToDeleteFiltered.size === 0) {
              const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("***No messages to delete.***");
              return await interaction.followUp({
                embeds: [embed],
                flags: ["Ephemeral"],
              });
            }

            const amount = await channel.bulkDelete(messagesToDeleteFiltered);
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `***:white_check_mark: Purged ${amount.size} messages.***`
              );
            return await interaction.followUp({
              embeds: [embed],
              flags: ["Ephemeral"],
            });
          }
        }
      } catch (err) {
        return;
      }
    }
  },
});
