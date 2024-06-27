//Imports
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import afkSchema from "../../schemas/afkSchema";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription(
      "Sets your status to AFK so that people can know that you're AFK"
    )
    .addStringOption((s) =>
      s
        .setName("reason")
        .setDescription("Reason why you are going afk?")
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction: any, client: any) {
    const { guild, options, user, member } = interaction;

    //Variables
    const reason = options.getString("reason");

    const data = await afkSchema.findOne({
      guildId: guild.id,
      userId: user.id,
    });
    if (data) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:warning: You're already AFK***");
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      const nickname = member.nickname || user.username;

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          "***:white_check_mark: Successfully set your status to AFK***"
        );
      await interaction.reply({ embeds: [embed], ephemeral: true });

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
};
