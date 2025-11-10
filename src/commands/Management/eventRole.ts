import eventRoleSchema from "../../schemas/eventsRoleSchema";
import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ApplicationCommandOptionType,
  InteractionContextType,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "event-hostrole",
  description: "the role that hosts an event",
  options: [
    {
      name: "role",
      description: "choose the role",
      type: ApplicationCommandOptionType.Role,
      required: true
    },
  ],
  defaultMemberPermissions: ["Administrator"],
  contexts: [InteractionContextType.Guild],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;
    const getRole = args.getRole("role");
    const role = guild.roles.cache.get(getRole.id);

    try {
      const data = await eventRoleSchema.findOne({ guildId: guild.id });

      if (!data || !data.roleId) {
        const embed = new EmbedBuilder()
          .setTitle("Role chosen")
          .setDescription(
            `The role \`${role.name}\` has been successfully selected as the role required to host.`
          )
          .setColor("Green");
        interaction.reply({ embeds: [embed], flags: "Ephemeral" });

        return await new eventRoleSchema({
          guildId: guild.id,
          roleId: role.id,
        }).save();
      } else {
        const button = new ButtonBuilder()
          .setCustomId("hostrolebtn")
          .setLabel("Remove role?")
          .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder().addComponents(button);

        const embed = new EmbedBuilder()
          .setTitle("A role is already chosen!")
          .setDescription(
            `<@&${data.roleId}> (${data.roleId}) is already chosen as the role required to host in this server!`
          )
          .setColor("Red");
        interaction.reply({
          embeds: [embed],
          components: [row.toJSON()],
          flags: "Ephemeral",
        });
      }
    } catch (err) {
      return;
    }
  },
});
