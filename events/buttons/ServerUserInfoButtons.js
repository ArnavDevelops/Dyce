const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId } = interaction;

    if (interaction.isButton()) {
      //Server info's button
      if (customId === "roles") {
        const guildRoles = interaction.guild.roles.cache
          .filter((r) => r.id !== interaction.guild.id)
          .sort((a, b) => b.position - a.position)
          .map((r) => r.toString())
          .join(`\n`);
        const guildrolesSize = interaction.guild.roles.cache.size;

        const embed = new EmbedBuilder()
          .setColor(`Yellow`)
          .setTitle(`Roles [${guildrolesSize}]`)
          .setDescription(`${guildRoles}`);

        interaction.reply({ embeds: [embed], ephemeral: true });
      }

      //User info's button
      if (customId === "member_roles") {
        const targetMember = await interaction.guild.members.fetch(
          interaction.user
        );
        const memberRoles = targetMember.roles.cache
          .filter((r) => r.id !== interaction.guild.id)
          .sort((a, b) => b.position - a.position)
          .map((r) => r.toString())
          .join(`\n`);
        const memberRolesSize = targetMember.roles.cache.size;

        const embed = new EmbedBuilder()
          .setColor(`Random`)
          .setTitle(`Roles [${memberRolesSize}]`)
          .setDescription(`${memberRoles}`);

        interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }
  },
};
