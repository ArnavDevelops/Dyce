const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guildlist")
    .setDescription("Lists all guilds the bot is in.")
    .setDMPermission(false),
  async execute(interaction, client) {
    try {
      await interaction.deferReply({ ephemeral: true });
      if (interaction.user.id !== "947568482407546991") {
        const permissionEmbed = new EmbedBuilder()
          .setDescription(
            "***:warning: Only the Owner of this bot can run this command.***"
          )
          .setColor(`Red`);
        await interaction.followUp({
          embeds: [permissionEmbed],
          ephemeral: true,
        });
      } else {
        const guilds = client.guilds.cache;
        let guildList = "";

        for (const [guildId, guild] of guilds) {
          const owner = guild.members.cache.get(guild.ownerId);
          if (!owner) continue;

          guildList += `**Guild**: ${guild.name} (${guildId})\n`;
          guildList += `**Members**: ${guild.memberCount}\n`;
          guildList += `**Owner**: ${owner.user.username} (${owner.user.id})\n`;
          let bot = guild.members.cache.get(client.user.id);
          if (
            bot.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)
          ) {
            const inviteChannel = guild.channels.cache.find(
              (c) => c.type === 0
            );
            if (inviteChannel) {
              const invite = await inviteChannel.createInvite();
              guildList += `**Invite**: ${invite.url}\n\n`;
            } else {
              guildList += "**Invite**: Invite cannot be generated\n\n";
            }
          } else {
            guildList +=
              "**Invite**: Bot does not have permission to create invites\n\n";
          }
        }

        const embed = new EmbedBuilder()
          .setTitle("Guilds")
          .setDescription(guildList)
          .setColor("Random")
          .setTimestamp();

        await interaction.followUp({
          embeds: [embed],
          ephemeral: true,
        });
      }
    } catch (error) {
      return;
    }
  },
};
