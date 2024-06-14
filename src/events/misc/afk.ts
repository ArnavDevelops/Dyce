//Imports
import { ChannelType } from "discord.js";
import autoPublishSchema from "../../schemas/autoPublishSchema"
import afkSchema from "../../schemas/afkSchema"

//Message Create event
module.exports = {
    name: "messageCreate",
    async execute(message: any) {
        const { guild, channel } = message;

        if (message.author.bot) return;
        if(message.content.includes('@here' || '@everyone')) return;

        const check = await afkSchema.findOne({ guildId: guild.id, userId: message.author.id })

        if (check) {
            message.member.setNickname(check.nickname).catch((err: any) => { return; })
            return await afkSchema.deleteMany({ guildId: guild.id, userId: message.author.id })
        } else {
            const members = message.mentions.users.first()
            if (!members) return;
            const data = await afkSchema.findOne({ guildId: guild.id, userId: members.id })
            if (!data) return;

            const member = guild.members.cache.get(members.id);
            const reason = data.reason

            try {
                if (message.content.includes(members)) {
                    const m = await message.reply(`**:warning: ${member.user.username} is currently afk** (<t:${Math.floor(data.date as any / 1000)}:R>) | **Reason:** ${reason}`)

                    setTimeout(async () => {
                        message.delete()
                    }, 1000)

                    setTimeout(() => {
                        m.delete()
                    }, 10000)
                }
            } catch (e) {
                return;
            }
        }
    }
}