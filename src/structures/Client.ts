import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from 'discord.js';
import { glob } from 'glob';
import { promisify } from 'util';
import { CommandType } from '../typings/Command';
import { RegisterCommandsOptions } from '../typings/client';
import logMessage from '../typings/logging';
import { Event } from './Event';

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  buttons: Collection<string, any>
  selectMenus: Collection<string, any>

  constructor() {
    super({ intents: 32767 })
  }

  start() {
    this.registerModules()
    this.login(process.env.Token)
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({commands}: RegisterCommandsOptions) {
    this.application?.commands.set(commands);
    logMessage('Registering Commands', 'INFO')

  }
  async registerModules() {
    //Commands
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await glob(`${__dirname}/../commands/*/*{.ts,.js}`);
    console.log({ commandFiles });
    commandFiles.forEach(async (filepath) => {
        const command = await this.importFile(filepath)
        if(!command.name) return;

        this.commands.set(command.name, command)
        slashCommands.push(command)
    });
    
    //Events
    const eventFiles = await glob(
      `${__dirname}/../events/*/*{.ts,.js}`
    );
    eventFiles.forEach(async filepath => {
      const event: Event<keyof ClientEvents> = await this.importFile(filepath)
      this.on(event.event, event.run)
    })
  }
}