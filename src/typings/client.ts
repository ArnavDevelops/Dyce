import { ApplicationCommandDataResolvable } from "discord.js";

export interface RegisterCommandsOptions {
    clientId?: string;
    commands: ApplicationCommandDataResolvable[];
}