//Imports
import logMessage from "../../typings/logging";

//Database Disconnected
module.exports = {
  name: "disconnected",
  async execute() {
    logMessage("Disconnected", "DATABASE STATUS");
  },
};
