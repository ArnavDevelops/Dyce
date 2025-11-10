import {
  EmbedBuilder,
  InteractionContextType,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "unban",
  description: "Unbans a user",
  defaultMemberPermissions: ["BanMembers"],
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "user",
      description: "Select the user or input a userID",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "The reason",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "delete_messages",
      description: "Should the messages be deleted?",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
    {
      name: "note",
      description: "Anything to note about this particular action?",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;

    const user = args.getUser("user");
    const reason = args.getString("reason");

    try {
      await guild.bans.fetch().then(async (bans: any) => {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("***:x: there is no one banned in this Server.***");
        if (bans.size === 0)
          return await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });

        let bannedID = bans.find((ban: any) => ban.user.id == user);
        const embed1 = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: This user is not banned in this Server.***"
          );
        if (!bannedID)
          return await interaction.reply({ embeds: [embed1], flags: ["Ephemeral"] });

        await guild.bans.remove(user, reason).catch(async (err: Error) => {
          const cantunbanthisUser = new EmbedBuilder()
            .setColor("Red")
            .setDescription("***:warning: I cannot unban this user.***");
          return await interaction.reply({
            embeds: [cantunbanthisUser],
            flags: ["Ephemeral"],
          });
        });
      });
      const ubEmbed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `***:white_check_mark: Successfully unbanned ${user.username} (${user.id}) || reason: ${reason}***`
        );
      return await interaction.reply({ embeds: [ubEmbed] });
    } catch (err) {
      return;
    }
  },
});
