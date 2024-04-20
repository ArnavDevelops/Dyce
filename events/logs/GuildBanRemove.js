const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  name: "guildBanRemove",
  async execute(ban) {
    try {
      const logData = await logSchema.findOne({ Guild: ban.guild.id });
      if (!logData) return;

      const logChannel = ban.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      const auditLog = await ban.guild
        .fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove, limit: 1 })
        .then((audit) => audit.entries.first());
      const { executor } = auditLog;

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({
          name: `${ban.user.username} has been Unbanned`,
          iconURL: ban.user.avatarURL(),
        })
        .setDescription(`**User:**\n ${ban.user.username} (${ban.user.id})`)
        .setThumbnail(ban.user.avatarURL())
        .setFooter({
          text: `Moderator: ${executor.username}`,
          iconURL: executor.avatarURL(),
        })
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (err) {
      return;
    }
  },
};
