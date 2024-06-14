console.clear();

//Imports
import "dotenv/config"
import { Client, Collection, GatewayIntentBits, REST, Routes } from "discord.js";
import CustomClient from "./helpers/CustomClient";
import mongoose from "mongoose"
import { readdirSync } from "fs";
import logMessage from "./helpers/logging"

const mongoToken = process.env.mongoToken;
const Token = process.env.Token;
const clientId = process.env.clientId;

const rest = new REST({ version: "9" }).setToken(Token as string);

//Client
const client: CustomClient = new Client({
  intents: Object.values(GatewayIntentBits).reduce((a: any, b: any) => a | b, 0),
}) as CustomClient;

client.commands = new Collection();
client.commandArray = [];
client.buttons = new Collection();
client.selectMenus = new Collection();

//Commands folder
const commandFolders = readdirSync("./src/commands");
for (const folder of commandFolders) {
  const commandFiles = readdirSync(`./src/commands/${folder}`).filter((file: any) =>
    file.endsWith(`.ts`)
  );
  const { commands, commandArray } = client;
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    if (command.data.name) {
      commands.set(command.data.name, command);
    }
    commandArray.push(command.data.toJSON());
  }
}

//Events folder
const eventFolders = readdirSync("./src/events");
for (const folder of eventFolders) {
  const eventFiles = readdirSync(`./src/events/${folder}`).filter((file: any) =>
    file.endsWith(`ts`)
  );
  for (const file of eventFiles) {
    const event = require(`./events/${folder}/${file}`);
    if (event.once)
      client.once(event.name, (...args: any) =>
        event.execute(...args, client)
      );
    else
      client.on(event.name, (...args: any) =>
        event.execute(...args, client)
      );
  }
}
try {
  logMessage("Started refreshing application (/) commands.", "INFO");
  rest.put(Routes.applicationCommands(clientId as string), {
    body: client.commandArray,
  });
  logMessage("Successfully reloaded application (/) commands.", "INFO");
} catch (error: any) {
  logMessage("Error refreshing application (/) commands", "ERROR");
  logMessage(error.message, "ERROR");
}

// ===============================================
// Error handling
// ===============================================

//UnhandledRejection
process.on("unhandledRejection", (err: Error) => {
  logMessage(err.message, "ERROR");
});

//UncaughtException
process.on("uncaughtException", (err: Error) => {
  logMessage(err.message, "ERROR");
});

//Bot start-up
logMessage(`Initializing Command and Event handlers...`, "INFO");
client.login(Token);

//Database start-up
(async () => {
  await mongoose.connect(mongoToken as string).catch((err) => {
    logMessage(err, "ERROR");
  });
})();

//Process exit
process.on("exit", (code: string) => {
  logMessage(`Process exited with code ${code}`, "INFO");
  mongoose.connection.close();
});
