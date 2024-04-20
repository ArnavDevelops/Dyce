//Imports
const { logMessage } = require("../../helpers/logging.js");

//Database Connected
module.exports = {
  name: "connected",
    /**
  * @param {Client} client
  */
  async execute(client) {
    logMessage("Connected", "DATABASE STATUS");
  },
};
