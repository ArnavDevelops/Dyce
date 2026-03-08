console.clear();
process.stdout.write('\x1Bc');

import "dotenv/config";
import { ExtendedClient } from "./structures/Client";
import sequelize from "./structures/database";
import logging from "./typings/logging";

//Register models
import "./schemas/afkSchema";
import "./schemas/autoPublishSchema"
import "./schemas/eventsRoleSchema"
import "./schemas/eventsSchema"
import "./schemas/joinRoleSchema"
import "./schemas/logSchema"
import "./schemas/modNotesSchema"
import "./schemas/pointsSchema"
import "./schemas/reactionRolesSchema"
import "./schemas/softbanRoleSchema"
import "./schemas/softbanSchema"
import "./schemas/tempBanSchema"
import "./schemas/warnSchema"

export const client = new ExtendedClient();

async function start() {
    await sequelize.authenticate();
    console.log(sequelize.models);
    await sequelize.sync({ alter: true });

    client.start();
}

start().catch((err) => {
    logging(`Startup failed: ${err}`, "ERROR");
    process.exit(1);
});