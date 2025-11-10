import { Button } from "../../structures/Button";
import { EmbedBuilder } from "discord.js";
import joinRoleSchema from "../../schemas/joinRoleSchema";

export default new Button("joinrolebtn", async ({ interaction }) => {
  await joinRoleSchema.findOneAndDelete({ guildId: interaction.guild.id });

  const embed = new EmbedBuilder()
    .setColor("Green")
    .setDescription(
      "***:white_check_mark: Successfully removed the role for automatic join role. You can re-run the command to set the new auto join role for this server.***"
    );
  return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
});
