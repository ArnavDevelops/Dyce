import {
  EmbedBuilder,
  CommandInteractionOptionResolver,
  ButtonInteraction,
} from "discord.js";
import { Event } from "../../structures/Event";
import { ExtendedInteraction } from "../../typings/Command";
import { client } from "../../";

export default new Event("interactionCreate", async (interaction) => {
  //Application Commands
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      await interaction.deferReply();
      return interaction.followUp("You have used an nonexistent command");
    }

    try {
      await command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction,
      });
    } catch (err) {
      console.log(err);
    }
  }

  //Buttons
  else if (interaction.isButton()) {
    //const button = client.buttons.get(interaction.customId);
    const button = [...client.buttons.values()].find((b) =>
      interaction.customId.startsWith(b.customId)
    );
    if (!button)
      return console.log(`There's no code for ${interaction.customId} button`);

    try {
      await button.run({
        client,
        interaction: interaction as ButtonInteraction,
      });
    } catch (err) {
      console.log(err);
    }
  }

  //Only one selectmenu - /help
  else if (
    interaction.isStringSelectMenu() &&
    interaction.customId.startsWith("helpSelect-")
  ) {
    const userId = interaction.customId.split("-")[1];

    if (interaction.user.id !== userId) return;

    const embeds: Record<string, EmbedBuilder> = {
      faqs: new EmbedBuilder()
        .setTitle("FAQs")
        .setColor("White")
        .setDescription(
          "The following are the FAQs answered by the Developer/Owner."
        )
        .addFields([
          {
            name: "Where is the support server?",
            value: "A: https://discord.gg/mjMKFQDDaD",
          },
          {
            name: "What is Application did not respond?",
            value: "A: It means...",
          },
          // ...etc
        ]),

      moderation: new EmbedBuilder()
        .setTitle("Moderation")
        .setColor("White")
        .setDescription(
          "The following are the moderation commands of this bot!"
        )
        .addFields([
          { name: "/ban", value: "Bans people from the server permanently." },
          // etc.
        ]),

      community: new EmbedBuilder()
        .setTitle("Community")
        .setColor("White")
        .setDescription("The following are the community commands of this bot!")
        .addFields([
          { name: "/afk", value: "Go afk with it." },
          // etc.
        ]),

      management: new EmbedBuilder()
        .setTitle("Management")
        .setColor("White")
        .setDescription(
          "The following are the management commands of this bot!"
        )
        .addFields([
          {
            name: "/auto-publish",
            value: "Starts automatically publishing announcements.",
          },
          // etc.
        ]),

      dev: new EmbedBuilder()
        .setTitle("Dev")
        .setColor("White")
        .setDescription("The following are the Developer commands of this bot!")
        .addFields([
          { name: "/invite", value: "Returns an embed with an invite button." },
          // etc.
        ]),
    };

    const selected = interaction.values[0];
    const embed = embeds[selected];

    if (!embed)
      return interaction.reply({
        content: "Invalid selection.",
        flags: ["Ephemeral"],
      });
    await interaction.update({ embeds: [embed] });
  }
});
