const {
    EmbedBuilder,
} = require("discord.js");
const reactionRolesSchema = require(`../../schemas/reactionRolesSchema.js`)

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        const { customId, guild, channel, member } = interaction;

        if (!interaction.isButton()) return;

        const data = await reactionRolesSchema.findOne({ guildId: guild.id, channelId: channel.id });
        if (!data) return;

        if (customId === "role1") {
            const role = guild.roles.cache.get(data.role1);

            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role.id);

                const embed = new EmbedBuilder()
                    .setDescription(`***Removed ${role.name}.***`)
                    .setColor("Red");
                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                await member.roles.add(role.id)

                const embed = new EmbedBuilder()
                    .setDescription(`***Added ${role.name}.***`)
                    .setColor("Green")
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } else if (customId === "role2") {
            const role = guild.roles.cache.get(data.role2);

            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role.id);

                const embed = new EmbedBuilder()
                    .setDescription(`***Removed ${role.name}.***`)
                    .setColor("Red");
                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                await member.roles.add(role.id)

                const embed = new EmbedBuilder()
                    .setDescription(`***Added ${role.name}.***`)
                    .setColor("Green")
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } else if (customId === "role3") {
            const role = guild.roles.cache.get(data.role3);

            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role.id);

                const embed = new EmbedBuilder()
                    .setDescription(`***Removed ${role.name}.***`)
                    .setColor("Red");
                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                await member.roles.add(role.id)

                const embed = new EmbedBuilder()
                    .setDescription(`***Added ${role.name}.***`)
                    .setColor("Green")
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } else if (customId === "role4") {
            const role = guild.roles.cache.get(data.role4);

            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role.id);

                const embed = new EmbedBuilder()
                    .setDescription(`***Removed ${role.name}.***`)
                    .setColor("Red");
                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                await member.roles.add(role.id)

                const embed = new EmbedBuilder()
                    .setDescription(`***Added ${role.name}.***`)
                    .setColor("Green")
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
}