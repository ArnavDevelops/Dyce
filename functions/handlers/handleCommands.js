//Imports
const { readdirSync } = require("fs");
require("dotenv").config();
const { REST } = require("discord.js");
const { Routes } = require("discord-api-types/v9");
const { logMessage } = require("../../helpers/logging.js");
const token = process.env.Token,
  clientId = process.env.clientId;
const rest = new REST({ version: "9" }).setToken(token);

//Command handler
module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = readdirSync("./commands");
    for (const folder of commandFolders) {
      const commandFiles = readdirSync(`./commands/${folder}`).filter((file) =>
        file.endsWith(`.js`)
      );
      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        if (command.data.name) {
          commands.set(command.data.name, command);
        }
        commandArray.push(command.data.toJSON());
      }
    }

    try {
      logMessage("Started refreshing application (/) commands.", "INFO");
      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });
      logMessage("Successfully reloaded application (/) commands.", "INFO");
    } catch (error) {
      logMessage("Error refreshing application (/) commands", "ERROR");
      logMessage(error.stack, "ERROR");
    }
  };
};
