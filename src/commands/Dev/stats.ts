//Imports
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Statistics of the bot!")
        .setDMPermission(false),
    async execute(interaction: any, client: any) {
        //Uptime
        let days = Math.floor(interaction.client.uptime / 86400000);
        let hours = Math.floor(interaction.client.uptime / 3600000) % 24;
        let minutes = Math.floor(interaction.client.uptime / 60000) % 60;
        let seconds = Math.floor(interaction.client.uptime / 1000) % 60;

        const embed = new EmbedBuilder()
            .setAuthor({ iconURL: "https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&", name: "Dyce Statistics" })
            .setColor("White")
            .addFields([
                { name: "Servers", value: `${client.guilds.cache.size}`, inline: true },
                { name: "Users", value: `${client.users.cache.size}`, inline: true },
                { name: "Commands", value: `${client.commands.size}`, inline: true },
                {
                    name: `Uptime`,
                    value: `⏳ \`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds\``,
                }
            ])
            .setFooter({ iconURL: "https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&", text: "Github: https://github.com/ArnavDevelops/Dyce" })
        return await interaction.reply({ embeds: [embed] })
    }
}