import { Button } from "../../structures/Button";
import { EmbedBuilder } from "discord.js";
import eventRoleSchema from "../../schemas/eventsRoleSchema";

export default new Button("hostrolebtn", async ({ interaction }) => {
  await eventRoleSchema.findOneAndDelete({ guildId: interaction.guild.id });

  const embed = new EmbedBuilder()
    .setColor("Green")
    .setDescription(
      "***:white_check_mark: Successfully removed the required role for host. You can re-run the command to set the new required role for this server.***"
    );
  return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
});
