import { ClientEvents } from "discord.js";
import { ExtendedClient } from "./Client";

export class Event<Key extends keyof ClientEvents> {
    constructor(
        public event: Key,
        public run: (...args: ClientEvents[Key]) => any
    ) {}
}