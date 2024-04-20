//Imports
const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

//Interaction Create event
module.exports = {
  name: "interactionCreate",
  /**
  * @param {Client} client
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction, client) {
    //Application Commands
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error.stack);

        //Error being logged in a channel
        const channel = client.channels.cache.get("1147537207456968909");

        const embed = new EmbedBuilder()
          .setColor("Yellow")
          .setTimestamp()
          .setFooter({ text: "Error Reported At" })
          .setTitle("Command Execution Error")
          .setDescription("An error occurred while executing the command.")
          .addFields(
            {
              name: "> •   Command",
              value: `\`\`\`${interaction.commandName}\`\`\``,
            },
            {
              name: "> •   Triggered By",
              value: `\`\`\`${interaction.user.username}\`\`\``,
            },
            { name: "> •   Error Stack", value: `\`\`\`${error.stack}\`\`\`` },
            {
              name: "> •   Error Message",
              value: `\`\`\`${error.message}\`\`\``,
            }
          );
        await channel.send({ embeds: [embed] });

        await interaction.deferReply({ ephemeral: true });
        const commandErrorEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `***:warning: Something went wrong while executing this command***`
          );
        await interaction.followUp({
          embeds: [commandErrorEmbed],
          ephemeral: true,
        });
      }
    }

    //Buttons
    else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;
      const button = buttons.get(customId);
      if (!button) return new Error("There is no code for this button");

      try {
        await button.execute(interaction, client);
      } catch (err) {
        console.log(err);
      }
    }

    //Context menus
    else if (interaction.isContextMenuCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const contextCommand = commands.get(commandName);
      if (!contextCommand) return;

      try {
        await contextCommand.execute(interaction, client);
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
  },
};
