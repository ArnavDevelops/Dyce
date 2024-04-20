console.clear();

//Imports
const process = require(`node:process`);
require("dotenv").config();
const mongoToken = process.env.mongoToken;
const Token = process.env.Token;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { connect } = require("mongoose");
const { readdirSync } = require("fs");
const { logMessage } = require("./helpers/logging.js");
console.log();

//Client
const client = new Client({
  intents: Object.values(GatewayIntentBits).reduce((a, b) => a | b, 0),
});
client.commands = new Collection();
client.commandArray = [];
client.buttons = new Collection();
client.selectMenus = new Collection();

//Functions folder
const functionFolders = readdirSync(`./functions`);
for (const folder of functionFolders) {
  const functionFolders = readdirSync(`./functions/${folder}`).filter((file) =>
    file.endsWith(".js")
  );
  for (const file of functionFolders)
    try {
      require(`./functions/${folder}/${file}`)(client);
    } catch (err) {
      return;
    }
}

// ===============================================
// Error handling
// ===============================================

//UnhandledRejection
process.on("unhandledRejection", (err) => {
  logMessage(err.stack, "ERROR");
});

//UncaughtException
process.on("uncaughtException", (err) => {
  logMessage(err.stack, "ERROR");
});

// ===============================================
// Startup
// ===============================================
client.handleEvents();
client.handleCommands();

//Bot start-up
logMessage(`Initializing Command and Event handlers...`, "INFO");
client.login(Token);

//Database start-up
(async () => {
  await connect(mongoToken).catch((err) => {
    logMessage(err.stack, "ERROR");
  });
})();

//Process exit
process.on("exit", (code) => {
  logMessage(`Process exited with code ${code}`, "INFO");
  mongoose.connection.close();
});
