import { EmbedBuilder, AuditLogEvent, TextChannel } from "discord.js";
import logSchema from "../../schemas/logSchema";
import { Event } from "../../structures/Event";

export default new Event("guildBanRemove", async (ban) => {
  try {
    const logData = await logSchema.findOne({ Guild: ban.guild.id });
    if (!logData) return;

    const logChannel = ban.guild.channels.cache.get(
      logData.Channel
    ) as TextChannel;
    if (!logChannel) return;

    const auditLog = await ban.guild
      .fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove, limit: 1 })
      .then((audit: any) => audit.entries.first());
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
});
