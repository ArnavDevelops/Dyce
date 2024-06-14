import { Client, Collection } from 'discord.js';

interface CustomClient extends Client {
  commands: Collection<string, any>;
  commandArray: any[];
  handleEvents: () => any;
  handleCommands: () => any;
  buttons: Collection<string, any>
  selectMenus: Collection<string, any>
}

export default CustomClient;