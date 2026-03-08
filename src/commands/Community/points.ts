import {
  EmbedBuilder,
  InteractionContextType,
  ApplicationCommandOptionType,
} from "discord.js";
import pointsSchema from "../../schemas/pointsSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "points",
  description: "Change points",
  contexts: [InteractionContextType.Guild],
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: "increase",
      description: "Increases points",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "select the user",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "points",
          description: "the number of points to change",
          type: ApplicationCommandOptionType.Number,
          min_value: 0,
          max_value: 25,
          required: true,
        },
      ],
    },
    {
      name: "decrease",
      description: "Decreases points",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "select the user",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "points",
          description: "the number of points to change",
          type: ApplicationCommandOptionType.Number,
          min_value: 0,
          max_value: 25,
          required: true,
        },
      ],
    },
  ],

  run: async ({ interaction, args }) => {
    const { guild } = interaction;

    const subcommand = args.getSubcommand();
    const targetUser = args.getUser("user");
    const amount = args.getNumber("points");

    const member = await guild.members.fetch(targetUser.id).catch(async () => {
      const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
              "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
          );

      await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
      return null;
    });

    if (!member) return;

    if (member.user.bot) {
      const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("***:x: Bots cannot have any points.***");

      return interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
    }

    const userPoints = await pointsSchema.findOne({
      where: {
        userId: member.id,
        guildId: guild.id,
      },
    });

    try {
      let newPoints = 0;

      if (subcommand === "increase") {
        if (userPoints) {
          userPoints.points += amount;
          newPoints = userPoints.points;
          await userPoints.save();
        } else {
          await pointsSchema.create({
            userId: member.id,
            guildId: guild.id,
            points: amount,
          });
          newPoints = amount;
        }
      }

      if (subcommand === "decrease") {
        if (!userPoints) {
          const embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                  "***:warning: The user you mentioned doesn't have any points.***"
              );

          return interaction.reply({
            embeds: [embed],
            flags: ["Ephemeral"],
          });
        }

        if (userPoints.points < amount) {
          const embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                  `***:warning: The mentioned user doesn't have that many points (User's points: ${userPoints.points}).***`
              );

          return interaction.reply({
            embeds: [embed],
            flags: ["Ephemeral"],
          });
        }

        userPoints.points -= amount;
        newPoints = userPoints.points;
        await userPoints.save();
      }

      const embed = new EmbedBuilder()
          .setColor("Green")
          .setDescription(
              `✅ <@${member.id}> ${subcommand === "increase" ? "received" : "lost"} ***${amount}P***`
          )
          .setFooter({
            text: `User's points: ${newPoints}P`,
            iconURL: member.user.avatarURL(),
          });

      return interaction.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
});