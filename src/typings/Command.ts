import {
  ApplicationCommandOptionData,
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  InteractionContextType,
  PermissionResolvable,
} from "discord.js";
import { ExtendedClient } from "../structures/Client";

/** Example
 * {
 *  name: "commandname",
 *  description: "any description"
 *  run: async({ }) => {
 *  }
 * }
 */
export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient;
  interaction: ExtendedInteraction;
  args?: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
  contexts?: InteractionContextType[];
  userPermissions?: PermissionResolvable[];
  options?: ApplicationCommandOptionData[];
  run: RunFunction;
} & ChatInputApplicationCommandData;
