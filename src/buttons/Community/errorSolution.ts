import { Button } from "../../structures/Button";
import { EmbedBuilder } from "discord.js";

export default new Button("solution", async ({ interaction }) => {
  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Solutions")
    .setDescription(
      "The following are the ways to solve problems related to command execution"
    )
    .addFields([
      {
        name: "By placing dyce's role on top",
        value:
          "If dyce's bot role is above others then dyce can easily execute every command, specially the ones related to Moderation.",
      },
      {
        name: "Retrying",
        value:
          "Sometimes the bot is not able to execute command. It's recommended to retry executing a command before reaching out to our support staff.",
      },
      {
        name: "Offline",
        value:
          "When bots go offline, they're unavailable to execute any commands. However, this doesn't necessarily mean that bots with the invisible symbol are offline.",
      },
      {
        name: "Joining our support server",
        value:
          "If you think that there is something wrong with the Bot or the command then you can join our support server: https://discord.gg/CrQMgtdRPB",
      },
    ]);
  return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
});
