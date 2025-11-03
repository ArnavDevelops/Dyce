console.clear();
process.stdout.write('\x1Bc'); // It fully resets the terminal state in contrast to console.clear(); remove this line if it creates issues

import "dotenv/config";
import { ExtendedClient } from "./structures/Client";
import mongoose from "mongoose";
import logMessage from "./typings/logging";
const mongoToken = process.env.mongoToken;

export const client = new ExtendedClient();

client.start();

/**MONGOOSE DATABASE */
(async () => {
  try {
    await mongoose.connect(mongoToken)
    logMessage("Connected to MongoDB", "DATABASE STATUS");
  } catch(err) {
    logMessage(err, "ERROR")
  }
})();

mongoose.connection.on("disconnected", () => {
  logMessage("Disconnected from MongoDB", "DATABASE STATUS");
});

mongoose.connection.on("reconnected", () => {
  logMessage("Reconnected to MongoDB", "DATABASE STATUS");
});

mongoose.connection.on("error", (err) => {
  logMessage(`Database error: ${err}`, "ERROR");
});

//Exit
process.on("exit", (code: string) => {
  logMessage(`Process exited with code ${code}`, "INFO");
  mongoose.connection.close();
});
