import { EmbedBuilder, PermissionsBitField } from "discord.js";
import reactionRolesSchema from "../../schemas/reactionRolesSchema";
import { Event } from "../../structures/Event";

export default new Event("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  if (!interaction.inCachedGuild()) return;

  const { customId, guild, channel, member } = interaction;

  const data = await reactionRolesSchema.findOne({
    guildId: guild.id,
    channelId: channel.id,
  });
  if (!data) return;

  if (customId === "role1") {
    const role = guild.roles.cache.get(data.role1);

    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role.id);

      const embed = new EmbedBuilder()
        .setDescription(`***Removed ${role.name}.***`)
        .setColor("Red");
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      await member.roles.add(role.id);

      const embed = new EmbedBuilder()
        .setDescription(`***Added ${role.name}.***`)
        .setColor("Green");
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } else if (customId === "role2") {
    const role = guild.roles.cache.get(data.role2);

    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role.id);

      const embed = new EmbedBuilder()
        .setDescription(`***Removed ${role.name}.***`)
        .setColor("Red");
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      await member.roles.add(role.id);

      const embed = new EmbedBuilder()
        .setDescription(`***Added ${role.name}.***`)
        .setColor("Green");
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } else if (customId === "role3") {
    const role = guild.roles.cache.get(data.role3);

    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role.id);

      const embed = new EmbedBuilder()
        .setDescription(`***Removed ${role.name}.***`)
        .setColor("Red");
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      await member.roles.add(role.id);

      const embed = new EmbedBuilder()
        .setDescription(`***Added ${role.name}.***`)
        .setColor("Green");
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } else if (customId === "role4") {
    const role = guild.roles.cache.get(data.role4);

    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role.id);

      const embed = new EmbedBuilder()
        .setDescription(`***Removed ${role.name}.***`)
        .setColor("Red");
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      await member.roles.add(role.id);

      const embed = new EmbedBuilder()
        .setDescription(`***Added ${role.name}.***`)
        .setColor("Green");
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } else if (customId === "rrdelete") {
    if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await reactionRolesSchema.findOneAndDelete({
        guildId: guild.id,
        channelId: channel.id,
      });
      return await channel.messages.delete(data.msgId);
    } else {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "***:warning: You cannot delete this embed as you don't have the `Administrator` permission.***"
        );
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
});
