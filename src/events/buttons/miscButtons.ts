import { EmbedBuilder } from "discord.js";
import softbanRoleSchema from "../../schemas/softbanRoleSchema"
import eventRoleSchema from "../../schemas/eventsRoleSchema"
import joinRoleSchema from "../../schemas/joinRoleSchema"

module.exports = {
    name: "interactionCreate",
    async execute(interaction: any, client: any) {
        const { customId, guild } = interaction;

        if (!interaction.isButton()) return;

        if (customId == "softban") {
            const role = await guild.roles.create({ name: "softban" });

            const embed = new EmbedBuilder()
                .setColor("Grey")
                .setDescription("***:white_check_mark: Successfully created `softban` role!***")
                .setFooter({ iconURL: "https://cdn.discordapp.com/emojis/1233294833389539390.webp?size=80&quality=lossless", text: "You need to manage if the role can view in specific channels or not yourself." })
            interaction.reply({ embeds: [embed], ephemeral: true });

            new softbanRoleSchema({
                guildId: guild.id,
                roleId: role.id,
            }).save();
        } else if (customId == "hostrolebtn") {
            await eventRoleSchema.findOneAndDelete({ guildId: guild.id });

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setDescription("***:white_check_mark: Successfully removed the required role for host. You can re-run the command to set the new required role for this server.***")
            return await interaction.reply({ embeds: [embed], ephemeral: true })
        } else if (customId == "joinrolebtn") {
            await joinRoleSchema.findOneAndDelete({ guildId: guild.id });

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setDescription("***:white_check_mark: Successfully removed the role for automatic join role. You can re-run the command to set the new auto join role for this server.***")
            return await interaction.reply({ embeds: [embed], ephemeral: true })
        } else if (customId == "solutions") {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Solutions")
                .setDescription("The following are the ways to solve problems related to command execution")
                .addFields([
                    { name: "By placing dyce's role on top", value: "If dyce's bot role is above others then dyce can easily execute every command, specially the ones related to Moderation." },
                    { name: "Retrying", value: "Sometimes the bot is not able to execute command. It's recommended to retry executing a command before reaching out to our support staff." },
                    { name: "Offline", value: "When bots go offline, they're unavailable to execute any commands. However, this doesn't necessarily mean that bots with the invisible symbol are offline." },
                    { name: "Joining our support server", value: "If you think that there is something wrong with the Bot or the command then you can join our support server: https://discord.gg/CrQMgtdRPB" }
                ])
            return await interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}