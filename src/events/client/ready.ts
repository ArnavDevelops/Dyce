import { ActivityType } from "discord.js";
import logMessage from "../../typings/logging";
import "dotenv/config";
import { Event } from "../../structures/Event";

//Ready event
export default new Event("clientReady", (client) => {
  client.user.setActivity({
    name: "/help",
    type: ActivityType.Watching,
  });
  logMessage(`${client.user.username} is online!`, "INFO");
});
