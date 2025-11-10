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
    //Increase
    if (args.getSubcommand() === "increase") {
      const { member, guild } = interaction;
      const e = args.getUser("user");
      const user = await guild.members.fetch(e).catch(async (err: Error) => {
        const failEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
          );
        await interaction.reply({ embeds: [failEmbed], flags: "Ephemeral" });
        return null;
      });
      if (!user) return;
      const points = args.getNumber("points");

      const userPoints = await pointsSchema.findOne({
        userId: user.id,
        guildId: guild.id,
      });
      const Bots = guild.members.cache.get(user.id);
      if (Bots.user.bot) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("***:x: Bots cannot have any points.***");
        return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
      }
      let addedPoints;

      try {
        if (userPoints) {
          addedPoints = userPoints.points += points;
          await userPoints.save();
        } else {
          await pointsSchema.create({
            userId: user.id,
            guildId: guild.id,
            points: points,
          });
        }

        const embed = new EmbedBuilder()
          .setDescription(`✅ <@${user.id}> has got ***${points}P*** `)
          .setFooter({
            text: `User's points: ${addedPoints || points}P`,
            iconURL: user.user.avatarURL(),
          })
          .setColor("Green");
        return await interaction.reply({ embeds: [embed] });
      } catch (err) {
        return;
      }
    }

    //Decrease
    else if (args.getSubcommand() === "decrease") {
      const { guild } = interaction;
      const e = args.getUser("user");
      const user = await guild.members.fetch(e).catch(async (err: Error) => {
        const failEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
          );
        await interaction.reply({ embeds: [failEmbed], flags: "Ephemeral" });
        return null;
      });
      if (!user) return;
      const points = args.getNumber("points");
      const member = guild.members.cache.get(user.id);
      if (member.user.bot) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("***:x: Bots cannot have any points.***");
        return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
      }

      const userPoints = await pointsSchema.findOne({
        userId: user.id,
        guildId: guild.id,
      });

      try {
        if (!userPoints) {
          const noPoints = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: The user you mentioned doesn't have any points.***"
            );
          return await interaction.reply({
            embeds: [noPoints],
            flags: "Ephemeral",
          });
        } else {
          if (userPoints.points < points) {
            const lessPoints = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `***:warning: The mentioned user doesn't have that many points (User's points: ${userPoints.points}).***`
              );
            return await interaction.reply({
              embeds: [lessPoints],
              flags: "Ephemeral",
            });
          }
          let removedPoints;

          removedPoints = userPoints.points -= points;
          await userPoints.save();

          const embed = new EmbedBuilder()
            .setDescription(
              `✅ <@${user.id}> now has ***${points}P*** deducted`
            )
            .setFooter({
              text: `User's points: ${removedPoints || points}P`,
              iconURL: user.user.avatarURL(),
            })
            .setColor("Green");
          return await interaction.reply({ embeds: [embed] });
        }
      } catch (err) {
        return;
      }
    }
  },
});
