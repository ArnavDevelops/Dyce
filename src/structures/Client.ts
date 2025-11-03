import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import { glob } from "glob";
import { CommandType } from "../typings/Command";
import { RegisterCommandsOptions } from "../typings/client";
import logMessage from "../typings/logging";
import { Event } from "./Event";
const rest = new REST({ version: "9" }).setToken(process.env.Token);

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  buttons: Collection<string, any>;
  selectMenus: Collection<string, any>;

  constructor() {
    super({
      intents: (Object.values(GatewayIntentBits) as number[]).reduce(
        (a, b) => a | b,
        0
      ),
    });
  }

  start() {
    this.registerModules();
    this.login(process.env.Token);
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({ commands }: RegisterCommandsOptions) {
    this.application?.commands.set(commands);
    logMessage("Registering Commands", "INFO");
  }

  async registerModules() {
    //Commands
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await glob(`${__dirname}/../commands/*/*{.ts,.js}`);
    console.log({ commandFiles });
    commandFiles.forEach(async (filepath) => {
      const command = await this.importFile(filepath);
      if (!command.name) return;

      this.commands.set(command.name, command);
      slashCommands.push(command);
    });

    this.on("clientReady", () => {
      this.registerCommands({
        commands: slashCommands,
      });
      rest.put(Routes.applicationCommands(process.env.clientId), {
        body: slashCommands,
      });
      logMessage("Commands Registered", "INFO");
    });

    //Events
    const eventFiles = await glob(`${__dirname}/../events/*/*{.ts,.js}`);
    eventFiles.forEach(async (filepath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filepath);
      this.on(event.event, event.run);
    });
  }
}
