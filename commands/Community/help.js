//Imports
const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Helps you with Commands & the Bot."),
    async execute(interaction, client) {
        //Buttons/Menu
        const select = new StringSelectMenuBuilder()
            .setCustomId('helpSelect')
            .setPlaceholder('Select!')
            .addOptions([
                new StringSelectMenuOptionBuilder({
                    label: 'FAQs',
                    value: 'faqs',
                    emoji: "❓"
                }),
                new StringSelectMenuOptionBuilder({
                    label: "Moderation",
                    value: "moderation",
                    emoji: "1234908255554375691",
                }),
                new StringSelectMenuOptionBuilder({
                    label: "Community",
                    value: "community",
                    emoji: "🕊️",
                }),
                new StringSelectMenuOptionBuilder({
                    label: "Management",
                    value: "management",
                    emoji: "🏢",
                }),
                new StringSelectMenuOptionBuilder({
                    label: "Dev",
                    value: "dev",
                    emoji: "🤖",
                }),
            ]);

        const row = new ActionRowBuilder()
            .addComponents(select);

        //Embed
        const embed = new EmbedBuilder()
            .setTitle("Help")
            .setColor("White")
            .setDescription("**What do you need help with? Select via the Select menu.**")
            .addFields([
                { name: "FAQS", value: "Frequently asked questions." },
                { name: "Moderation", value: "Helps you with commands used by the Moderators:- Timeout, Ban, Kick, etc." },
                { name: "Community", value: "Helps you with commands that can be used by everyone in the server:-avatar, user-info, etc." },
                { name: "Management", value: "Helps you with commands that can be used  by Admins to manage the server:- Reactionroles, embeds, logs, etc." },
                { name: "Dev", value: "Helps you with commands that are related to development or the bot itself." },
            ])
        return await interaction.reply({ embeds: [embed], components: [row] })
    }
}