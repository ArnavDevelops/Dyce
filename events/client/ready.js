//Imports
const { ActivityType } = require("discord.js");
const { logMessage } = require("../../helpers/logging.js");
require("dotenv").config()

//Ready event
module.exports = {
  name: "ready",
  once: true,
  /**
  * @param {Client} client
  */
  async execute(client) {


    //Status | Main function
    await client.user.setActivity({
      name: "/help", 
      type: ActivityType.Watching
    });

    //Bot startup
    logMessage(`${client.user.username} is online!`, "INFO");
  },
};
