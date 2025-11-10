import {
  EmbedBuilder,
  InteractionContextType,
  ApplicationCommandOptionType,
} from "discord.js";
import afkSchema from "../../schemas/afkSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "afk",
  description: "Go afk",
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "reason",
      description: "The reason",
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild, user, member } = interaction;

    const reason = args.getString("reason");

    const data = await afkSchema.findOne({
      guildId: guild.id,
      userId: user.id,
    });
    if (data) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:warning: You're already AFK***");
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    } else {
      const nickname = member.nickname || user.username;

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          "***:white_check_mark: Successfully set your status to AFK***"
        );
      await interaction.reply({ embeds: [embed], flags: "Ephemeral" });

      await new afkSchema({
        guildId: guild.id,
        userId: user.id,
        reason: reason,
        date: Date.now(),
        nickname: nickname,
      }).save();

      await member.setNickname(`[AFK] ${nickname}`).catch((err: any) => {
        return;
      });
    }
  },
});
