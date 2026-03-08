import afkSchema from "../../schemas/afkSchema";
import { Event } from "../../structures/Event";

export default new Event("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  if (
      message.content.includes("@here") ||
      message.content.includes("@everyone")
  ) return;

  const guild = message.guild;

  const check = await afkSchema.findOne({
    where: {
      guildId: guild.id,
      userId: message.author.id,
    }
  });

  if (check) {
    await message.member.setNickname(check.nickname).catch(() => {});
    await afkSchema.destroy({
      where: {
        guildId: guild.id,
        userId: message.author.id,
      }
    });
    return;
  }

  const mentioned = message.mentions.users.first();
  if (!mentioned) return;

  const data = await afkSchema.findOne({
    where: {
      guildId: guild.id,
      userId: mentioned.id,
    }
  });

  if (!data) return;

  const member = guild.members.cache.get(mentioned.id);
  const reason = data.reason;

  try {
    const reply = await message.reply(
        `**:warning: ${member.user.username} is currently AFK** (<t:${Math.floor(
            data.date / 1000
        )}:R>) | **Reason:** ${reason}`
    );

    setTimeout(() => message.delete().catch(() => {}), 1000);
    setTimeout(() => reply.delete().catch(() => {}), 10000);

  } catch {
    return;
  }
});