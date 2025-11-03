import { EmbedBuilder, TextChannel } from "discord.js";
import logSchema from "../../schemas/logSchema";
import joinRoleSchema from "../../schemas/joinRoleSchema";
import { Event } from "../../structures/Event";

export default new Event("guildMemberAdd", async (member) => {
  try {
    //JoinRole
    const joinRole = await joinRoleSchema.findOne({ guildId: member.guild.id });
    if (!joinRole) return;

    if (joinRole) {
      await member.roles.add(joinRole.roleId);
    }

    //Log
    const logData = await logSchema.findOne({ Guild: member.guild.id });
    if (!logData) return;

    const logChannel = member.guild.channels.cache.get(
      logData.Channel
    ) as TextChannel;
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setAuthor({
        name: `${member.user.username} just joined the server`,
        iconURL: member.user.avatarURL(),
      })
      .setDescription(`**User:**\n ${member.user.username} (${member.user.id})`)
      .setThumbnail(member.user.avatarURL())
      .setFooter({
        text: "Dyce#3312",
        iconURL:
          "https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&",
      })
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  } catch (err) {
    return;
  }
});
