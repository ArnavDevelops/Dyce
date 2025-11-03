import { EmbedBuilder, AuditLogEvent, TextChannel } from "discord.js";
import logSchema from "../../schemas/logSchema";
import { Event } from "../../structures/Event";

export default new Event("guildBanAdd", async (ban) => {
  try {
    const logData = await logSchema.findOne({ Guild: ban.guild.id });
    if (!logData) return;

    const logChannel = ban.guild.channels.cache.get(
      logData.Channel
    ) as TextChannel;
    if (!logChannel) return;

    const auditLog = await ban.guild
      .fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 })
      .then((audit: any) => audit.entries.first());
    const { reason, executor } = auditLog;

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({
        name: `${ban.user.username} has been Banned`,
        iconURL: ban.user.avatarURL(),
      })
      .setDescription(
        `**User:**\n ${ban.user.username} (${ban.user.id})\n **Reason:**\n ${
          reason || "Not specified"
        }`
      )
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
