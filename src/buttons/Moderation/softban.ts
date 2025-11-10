import { Button } from "../../structures/Button";
import { EmbedBuilder } from "discord.js";
import softbanRoleSchema from "../../schemas/softbanRoleSchema";

export default new Button("softban", async ({ interaction }) => {
  const { guild } = interaction;
  const role = await guild.roles.create({ name: "softban" });

  const embed = new EmbedBuilder()
    .setColor("Grey")
    .setDescription(
      "***:white_check_mark: Successfully created `softban` role!***"
    )
    .setFooter({
      iconURL:
        "https://cdn.discordapp.com/emojis/1233294833389539390.webp?size=80&quality=lossless",
      text: "You need to manage if the role can view in specific channels or not yourself.",
    });
  interaction.reply({ embeds: [embed], flags: "Ephemeral" });

  new softbanRoleSchema({
    guildId: guild.id,
    roleId: role.id,
  }).save();
});
