import { EmbedBuilder, AuditLogEvent } from "discord.js";
import logSchema from "../../schemas/logSchema"

module.exports = {
  name: "guildMemberRemove",
  async execute(member: any) {
    try {
      const logData = await logSchema.findOne({ Guild: member.guild.id });
      if (!logData) return;

      const logChannel = member.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;


      let rolesArray = [] as any;

      const roles = member.roles.cache.filter((r: any) => r.name !== "@everyone").map((r: any) => r.id);
      roles.forEach((role: any) => {
        rolesArray.push(`<@&${role}>`)
      });

      const fetchedlogs = await member.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberKick,
        Limit: 1,
      });
      const kicklog = fetchedlogs.entries.first();
      const { target, reason, executor } = kicklog;

      if (kicklog.createdAt < member.joinedAt) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setAuthor({
            name: `${member.user.username} just left the server`,
            iconURL: member.user.avatarURL(),
          })
          .setDescription(
            `**User:**\n ${member.user.username} (${member.user.id})\n
            **Roles:**\n ${rolesArray.join(`\n`)}`
          )
          .setThumbnail(member.user.avatarURL())
          .setFooter({
            text: "Dyce#3312",
            iconURL: `https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&`,
          })
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      }

      //Kick logs
      else if (target.id === member.id) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setAuthor({
            name: `${target.username} was kicked`,
            iconURL: target.avatarURL(),
          })
          .setDescription(
            `
        **User:**\n ${target.username} (${target.id})\n
        **Reason**\n ${reason || "Not specified"}`
          )
          .setThumbnail(target.avatarURL())
          .setFooter({
            text: `Moderator: ${executor.username}`,
            iconURL: `${executor.avatarURL()}`,
          })
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      }
    } catch (err) {
      return;
    }
  },
};
