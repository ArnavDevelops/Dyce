import { ButtonInteraction } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export class Button {
  public customId: string;
  public run: (options: { client: ExtendedClient; interaction: ButtonInteraction }) => Promise<any>;

  constructor(
    customId: string,
    run: (options: { client: ExtendedClient; interaction: ButtonInteraction }) => Promise<any>
  ) {
    this.customId = customId;
    this.run = run;
  }
}