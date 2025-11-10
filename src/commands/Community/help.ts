import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  EmbedBuilder,
  ActionRowBuilder,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "help",
  description: "Information about FAQs and Commands",
  run: async ({ interaction }) => {

    const select = new StringSelectMenuBuilder()
      .setCustomId(`helpSelect-${interaction.user.id}`)
      .setPlaceholder("Select!")
      .addOptions([
        new StringSelectMenuOptionBuilder({
          label: "FAQs",
          value: "faqs",
          emoji: "❓",
        }),
        new StringSelectMenuOptionBuilder({
          label: "Moderation",
          value: "moderation",
          emoji: "🛡️",
        }),
        new StringSelectMenuOptionBuilder({
          label: "Community",
          value: "community",
          emoji: "🕊️",
        }),
        new StringSelectMenuOptionBuilder({
          label: "Management",
          value: "management",
          emoji: "🏢",
        }),
        new StringSelectMenuOptionBuilder({
          label: "Dev",
          value: "dev",
          emoji: "🤖",
        }),
      ]);

    const row = new ActionRowBuilder().addComponents(select);

    const embed = new EmbedBuilder()
      .setTitle("Help")
      .setColor("White")
      .setDescription(
        "**What do you need help with? Select via the Select menu.**"
      )
      .addFields([
        { name: "FAQS", value: "Frequently asked questions." },
        {
          name: "Moderation",
          value:
            "Helps you with commands used by the Moderators:- Timeout, Ban, Kick, etc.",
        },
        {
          name: "Community",
          value:
            "Helps you with commands that can be used by everyone in the server:-avatar, user-info, etc.",
        },
        {
          name: "Management",
          value:
            "Helps you with commands that can be used  by Admins to manage the server:- Reactionroles, embeds, logs, etc.",
        },
        {
          name: "Dev",
          value:
            "Helps you with commands that are related to development or the bot itself.",
        },
      ]);
    return await interaction.reply({
      embeds: [embed],
      components: [row.toJSON()],
    });
  },
});
