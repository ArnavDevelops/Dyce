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
const rest = new REST({ version: "10" }).setToken(process.env.Token);

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  buttons: Collection<string, any> = new Collection();
  selectMenus: Collection<string, any> = new Collection();

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
    console.log("✅ Registering commands...");
    this.application?.commands.cache.clear();
    await this.application?.commands.fetch();
    await rest.put(Routes.applicationCommands(process.env.clientId), { body: [] });

    console.log("✨ Commands Registered successfully!");
    } catch (err) {
      console.error(err);
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
 