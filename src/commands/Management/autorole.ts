import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  InteractionContextType,
  ApplicationCommandOptionType,
} from "discord.js";
import joinRoleSchema from "../../schemas/joinRoleSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "autorole",
  description: "Automatically gives a role to users",
  contexts: [InteractionContextType.Guild],
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: "join",
      description: "The join role",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: "select the Role",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;

    if (args.getSubcommand() === "join") {
      const getRole = args.getRole("role");
      const role = guild.roles.cache.get(getRole.id);

      const data = await joinRoleSchema.findOne({ guildId: guild.id });

      if (data) {
        const button = new ButtonBuilder()
          .setCustomId("joinrolebtn")
          .setLabel("Remove role?")
          .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder().addComponents(button);

        const embed = new EmbedBuilder()
          .setTitle("A role is already chosen!")
          .setDescription("A role is already chosen as the autorole for join!")
          .setColor("Red");
        return await interaction.reply({
          embeds: [embed],
          components: [row.toJSON()],
          flags: "Ephemeral",
        });
      } else {
        const embed = new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `***:white_check_mark: Successully made ${role.name} as the automatic join role.***`
          );
        await interaction.reply({ embeds: [embed], flags: "Ephemeral" });

        try {
          await new joinRoleSchema({
            guildId: guild.id,
            roleId: role.id,
          }).save();
        } catch (err) {
          return;
        }
      }
    }
  },
});
