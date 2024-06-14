//Imports
import { ActivityType } from "discord.js";
import logMessage from "../../helpers/logging"
import "dotenv/config"

//Ready event
module.exports = {
  name: "ready",
  async execute(client: any) {

    //Status | Main function
    await client.user.setActivity({
      name: "/help", 
      type: ActivityType.Watching
    });

    //Bot startup
    logMessage(`${client.user.username} is online!`, "INFO");
  },
};
