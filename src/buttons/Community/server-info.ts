import { Button } from "../../structures/Button";
import { EmbedBuilder } from "discord.js";

export default new Button("roles", async ({ interaction }) => {
  const guildRoles = interaction.guild.roles.cache
    .filter((r: any) => r.id !== interaction.guild.id)
    .sort((a: any, b: any) => b.position - a.position)
    .map((r: any) => r.toString())
    .join(`\n`);
  const guildrolesSize = interaction.guild.roles.cache.size;

  const embed = new EmbedBuilder()
    .setColor(`Yellow`)
    .setTitle(`Roles [${guildrolesSize}]`)
    .setDescription(`${guildRoles}`);

  interaction.reply({ embeds: [embed], flags: "Ephemeral" });
});
