import { EmbedBuilder, ApplicationCommandOptionType, InteractionContextType, TextChannel, NewsChannel } from "discord.js";
import startTyping from "../../typings/startTyping";
import { Command } from "../../structures/Command";

export default new Command({
  name: "announce",
  description: "Send a message using the bot or announce something",
  options: [
    {
      name: "channel",
      description: "The channel",
      type: ApplicationCommandOptionType.Channel,
      required: true
    },
    {
      name: "message",
      description: "What should be the message?",
      type: ApplicationCommandOptionType.String,
      required: true
    },
  ],
  defaultMemberPermissions: ["Administrator"],
  contexts: [InteractionContextType.Guild],
  run: async ({ interaction, args }) => {

        const channel = args.getChannel("channel")
        if(!channel || !(channel instanceof TextChannel || channel instanceof NewsChannel)) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: Please select a valid text channel***"
            );
          return await interaction.reply({
            embeds: [embed],
            flags: "Ephemeral",
          });
        }

        const message = args.getString("message")

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`***:white_check_mark: Successfully sent the message in #${channel.name}.***`)
        await interaction.reply({ embeds: [embed], flags: "Ephemeral" });

        try {
            startTyping(channel)
            setTimeout(async () => {
                return await channel.send(`${message}\n **Requested by: ${interaction.user.username}**`)
            }, 2000)
        } catch (e) {
            return;
        }
    },
});
