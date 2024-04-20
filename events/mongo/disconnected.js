//Imports
const { logMessage } = require("../../helpers/logging.js");

//Database Disconnected
module.exports = {
  name: "disconnected",
    /**
  * @param {Client} client
  */
  execute(client) {
    logMessage("Disconnected", "DATABASE STATUS");
  },
};
