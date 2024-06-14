//Imports
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import pointsSchema from "../../schemas/pointsSchema"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("point-info")
        .setDescription("Check Information about someone's points.")
        .addUserOption((user) =>
            user
                .setName("user")
                .setDescription("Select the user.")
                .setRequired(true)
        )
        .setDMPermission(false),
    async execute(interaction: any, client: any) {
        const { guild, options } = interaction;
        try {
            const e = options.getUser("user") || interaction.user;
            const user = await guild.members.fetch(e).catch(async (err: Error) => {
                const failEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(
                        "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
                    );
                await interaction.reply({ embeds: [failEmbed], ephemeral: true });
                return null;
            });
            if (!user) return;

            const userPoints = await pointsSchema.find({
                userId: user.id,
            });
            const Bots = guild.members.cache.get(user.id);
            if (Bots.user.bot) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:x: Bots cannot have any points.***");
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const noPoints = new EmbedBuilder()
                .setDescription(
                    `***:warning: ${user.username || user.user.username} has no Points***`
                )
                .setColor("Red");
            if (userPoints.length < 1 || userPoints[0].points <= 0)
                return await interaction.reply({
                    embeds: [noPoints],
                    ephemeral: true,
                });

            let embedDescription = `**Points:** ${userPoints[0].points}P`;

            const embed = new EmbedBuilder()
                .setTitle(`***${user.username || user.user.username}'s Points***`)
                .setDescription(`${embedDescription}`)
                .setColor("Random");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            return;
        }
    }
}