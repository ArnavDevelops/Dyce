//Import
import AISchema from "../../schemas/AISchema"
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ai")
        .setDescription("Should AI be in this server or no?")
        .addBooleanOption((b) =>
            b
                .setName("boolean")
                .setDescription("Choose between true or false")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction: any, client: any) {
        const { guild, options } = interaction;

        const data = await AISchema.findOne({ guildId: guild.id, enabled: true });
        const boolean = options.getBoolean("boolean");
        if (boolean == true) {
            if (!data) {
                new AISchema({
                    guildId: guild.id,
                    enabled: true
                }).save()

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription("***:white_check_mark: AI has been enabled.***")
                return await interaction.reply({ embeds: [embed], ephemeral: true })

            } else if (data.enabled == false) {
                await AISchema.findOneAndUpdate({ guildId: guild.id }, { enabled: true })

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription("***:white_check_mark: AI has been enabled.***")
                return await interaction.reply({ embeds: [embed], ephemeral: true })
            } else if (data.enabled = true) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:warning: AI is already enabled in this server.***")
                return await interaction.reply({ embeds: [embed], ephemeral: true })
            }
        } else  if (boolean == false) {
            if (!data) {
                new AISchema({
                    guildId: guild.id,
                    enabled: false
                }).save()

                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:warning: AI is already disabled!***")
                return await interaction.reply({ embeds: [embed], ephemeral: true })

            } else if (data.enabled == true) {
                await AISchema.findOneAndUpdate({ guildId: guild.id }, { enabled: false })

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription("***:white_check_mark: AI has been disabled.***")
                return await interaction.reply({ embeds: [embed], ephemeral: true })
            } else if (data.enabled = false) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:warning: AI is already disabled in this server.***")
                return await interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }
    }
}