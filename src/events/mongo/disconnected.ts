//Imports
import logMessage from "../../helpers/logging";

//Database Disconnected
module.exports = {
  name: "disconnected",
  async execute() {
    logMessage("Disconnected", "DATABASE STATUS");
  },
};
