import {
  EmbedBuilder,
  InteractionContextType,
  ApplicationCommandOptionType,
  GuildMember,
} from "discord.js";

import { Command } from "../../structures/Command";

export default new Command({
  name: "set-nickname",
  description: "Changes the nickname",
  defaultMemberPermissions: ["ManageNicknames"],
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "user",
      description: "Select the user or input a userID",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "nickname",
      description: "The nickname",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async ({ interaction, args }) => {

    const user = args.getMember("user") as GuildMember;
    if (!user) return;
    const nickname = args.getString("nickname");

    if (nickname.length > 32) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "***:warning: You cannot use more then 32 characters!***"
        );
      return await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
    } else {
      try {
        await user.setNickname(nickname);

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `***:white_check_mark: Successfully changed ${user.user.username}'s nickname to "${nickname}"***`
          );
        return await interaction.reply({ embeds: [embed] });
      } catch (e) {
        console.log(e);
      }
    }
  },
});
