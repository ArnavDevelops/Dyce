import {
  EmbedBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  InteractionContextType,
  ApplicationCommandOptionType,
} from "discord.js";
import modNotesSchema from "../../schemas/modNotesSchema";
import { toMs } from "ms-typescript";
import softbanSchema from "../../schemas/softbanSchema";
import softbanRoleSchema from "../../schemas/softbanRoleSchema";

import { Command } from "../../structures/Command";

export default new Command({
  name: "softban",
  description: "Makes the server read-only for someone temporarily",
  defaultMemberPermissions: ["BanMembers"],
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "user",
      description: "Select the user",
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
      name: "duration",
      description: "The duration (Ex., 1h",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "note",
      description: "Any note for this action?",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild, member } = interaction;

    try {
      const banUser = args.getUser("user");
      const banMember = await guild.members.fetch(banUser);
      const reason = args.getString("reason");
      const duration = args.getString("duration");
      const note = args.getString("note");

      const durationRegex = /^\d+[smhdw]$/; // Modify this to include other units if needed
      if (!durationRegex.test(duration)) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: You can only use the format '<number><unit>', where unit can be 's'(seconds), m'(minutes), h' (hours), 'd' (days), or 'w' (weeks).***"
          );
        return await interaction.reply({
          embeds: [embed],
          flags: ["Ephemeral"],
        });
      } else {
        const softbanRoleData = await softbanRoleSchema.findOne({
          guildId: guild.id,
        });
        if (softbanRoleData == null) return;
        if (!softbanRoleData) {
          const button = new ButtonBuilder()
            .setCustomId("softban")
            .setLabel("Create role?")
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          2;
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: No `softban` role for this command to be executed!***"
            );

          await interaction.reply({
            embeds: [embed],
            components: [row.toJSON()],
            flags: ["Ephemeral"],
          });
        }
        const role = guild.roles.cache.get(softbanRoleData.roleId);
        if (!role) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: No role assigned for this command to be executed.***"
            );

          await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
        }

        const data = await softbanSchema.findOne({
          guildId: guild.id,
          userId: banUser.id,
        });
        if (data == null) return;

        if (banMember.id == member.id) {
          const cannotbanyourself = new EmbedBuilder()
            .setColor("Red")
            .setDescription("***:x: You can't ban yourself.***");
          return await interaction.reply({
            embeds: [cannotbanyourself],
            flags: ["Ephemeral"],
          });
        }

        if (banMember.user.bot) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("***:x: You cannot ban bots.***");
          return interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
        }

        if (banMember.permissions.has(PermissionsBitField.Flags.BanMembers)) {
          const cannotbanMods = new EmbedBuilder()
            .setColor("Red")
            .setDescription("***:x: I can't ban Moderators and Above.***");
          return await interaction.reply({
            embeds: [cannotbanMods],
            flags: ["Ephemeral"],
          });
        }

        if (banMember.roles.cache.has(role.id)) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("***:x: The user is already softbanned.***");
          return await interaction.reply({
            embeds: [embed],
            flags: ["Ephemeral"],
          });
        }

        if (!banMember.roles.cache.has(role.id)) {
          const dmEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `:warning: You have been softbanned in **${guild.name}** by ${member.user.username} for ${duration}`
            )
            .addFields({
              name: "Reason",
              value: `${reason}`,
            });
          await banMember.send({ embeds: [dmEmbed] }).catch((err: Error) => {
            return;
          });

          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `:white_check_mark: Successfully softbanned ***${banUser.username} for ${duration}***`
            )
            .addFields({
              name: "Reason",
              value: `${reason}`,
            })
            .setFooter({
              iconURL:
                "https://cdn.discordapp.com/emojis/1233294833389539390.webp?size=80&quality=lossless",
              text: "Softban makes a user unable to see most channels",
            });
          await interaction.reply({ embeds: [embed] });

          await banMember.roles.add(role);

          if (!data) {
            return await new softbanSchema({
              guildId: guild.id,
              userId: banUser.id,
              duration: duration,
            }).save();
          }
        }

        setTimeout(async () => {
          banMember.roles.remove(role);
          return await softbanSchema.deleteOne({
            userId: banUser.id,
            guildId: guild.id,
          });
        }, toMs(duration || data.duration));

        if (note) {
          return await new modNotesSchema({
            guildId: guild.id,
            moderatorId: interaction.user.id,
            command: "/softban",
            date: Date.now(),
            note: `Moderated: ${banMember.user.username} | **${note}**`,
          }).save();
        }
      }
    } catch (err) {
      return;
    }
  },
});
