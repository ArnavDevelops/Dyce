import {
  EmbedBuilder,
  CommandInteractionOptionResolver,
  ButtonInteraction,
} from "discord.js";
import { Event } from "../../structures/Event";
import { client } from "../..";
import { ExtendedInteraction } from "../../typings/Command";

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
    const button = client.buttons.get(interaction.customId);
    if (!button) return console.log(`There's no code for ${button} button`);

    try {
      await button.run({
        client,
        interaction: interaction as ButtonInteraction,
      });
    } catch (err) {
      console.log(err);
    }
  }

  //Context menus
  else if (interaction.isContextMenuCommand()) {
    const contextCommand = client.commands.get(interaction.commandName);
    if (!contextCommand) return;

    try {
      await contextCommand.run({
        client,
        interaction: interaction as ExtendedInteraction,
      });
    } catch (error) {
      console.error(error);
      const commandErrorEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(
          "***:warning: Something went wrong while executing this context menu***"
        );
      await interaction.reply({
        embeds: [commandErrorEmbed],
        ephemeral: true,
      });
    }
  }
});
