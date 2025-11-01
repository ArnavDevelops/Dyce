console.clear();

//Imports
import "dotenv/config";
import { ExtendedClient } from "./structures/Client";
import mongoose from "mongoose";
import logMessage from "./typings/logging";

const mongoToken = process.env.mongoToken;
const Token = process.env.Token;

//Client
export const client = new ExtendedClient();

client.start();

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
