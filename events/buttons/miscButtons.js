const {
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const softbanRoleSchema = require("../../schemas/softbanRoleSchema.js")
const eventRoleSchema = require("../../schemas/eventsRoleSchema.js")

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
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
        } else if(customId == "hostrolebtn") {
            await eventRoleSchema.findOneAndDelete({ guildId: guild.id });

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setDescription("***:white_check_mark: Successfully removed the required role for host. You can re-run the command to set the new required role for this server.***")
            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}