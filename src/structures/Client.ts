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
import { Event } from "./Event";
import { Button } from "./Button";
import logging from "../typings/logging";
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  buttons: Collection<string, any> = new Collection();
  //selectMenus: Collection<string, any> = new Collection();

  constructor() {
    super({
      intents: (Object.values(GatewayIntentBits) as number[]).reduce(
        (a, b) => a | b,
        0
      ),
    });
  }

  start() {
    this.registerModules().catch((err) => {
      logging(`Failed to register modules ${err}`, "ERROR")
    })
    this.login(process.env.TOKEN).catch((err) => {
      logging(`Failed to login: ${err}`, "ERROR")
    })
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerModules() {
    // Commands
    const slashCommands: ApplicationCommandDataResolvable[] = [];

    // ✅ Load commands properly (await each one)
    const commandFiles = await glob(`${__dirname}/../commands/*/*{.ts,.js}`);
    for (const filePath of commandFiles) {
      const command: CommandType = await this.importFile(filePath);
      if (!command?.name) continue;
      this.commands.set(command.name, command);
      slashCommands.push(command);
    }

    try {
    logging("✅ Registering commands...", "INFO");
    this.application?.commands.cache.clear();
    await this.application?.commands.fetch();
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: slashCommands });

    logging("✨ Commands Registered successfully!", "INFO");
    } catch (err) {
      logging(err, "ERROR")
    }

    //Events
    const eventFiles = await glob(`${__dirname}/../events/*/*{.ts,.js}`);
    for (const filepath of eventFiles) {
      const event: Event<keyof ClientEvents> = await this.importFile(filepath);
      this.on(event.event, event.run);
    }

    //Buttons
    const buttonsArray: any = []
    const buttonFiles = await glob(`${__dirname}/../buttons/*/*{.ts,.js}`)
    for (const filepath of buttonFiles) {
      const button: Button = await this.importFile(filepath)
      if(!button.customId) continue;
      this.buttons.set(button.customId, button)
      buttonsArray.push(button)
    }
  }
}
 