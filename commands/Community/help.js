const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Helps you with Commands & the Bot."),
    async execute(interaction, client) {

        const select = new StringSelectMenuBuilder()
            .setCustomId('helpSelect')
            .setPlaceholder('Select!')
            .addOptions(
                new StringSelectMenuOptionBuilder({
                    label: 'FAQs',
                    value: 'faqs'
                }),
                new StringSelectMenuOptionBuilder({
                    label: 'Moderation',
                    value: 'moderation'
                }),
                new StringSelectMenuOptionBuilder({
                    label: 'Community',
                    value: 'community'
                })
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        const embed = new EmbedBuilder()
            .setTitle("Help")
            .setDescription("**What do you need help with? Select via the Select menu.**")
            .addFields([
                { name: "Basics", value: "Helps you with what this bot has and can do." },
                { name: "Moderation", value: "Helps you with commands used by the Moderators - Ban, Kick, etc." },
                { name: "Community", value: "Helps you with commands that can be used by everyone in the server-avatar, user-info, etc." }
            ])
        interaction.reply({ embeds: [embed], components: [row] })
    }
}