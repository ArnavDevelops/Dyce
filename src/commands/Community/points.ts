import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import pointsSchema from "../../schemas/pointsSchema"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("points")
        .setDescription(
            "Add points to an user or remove points from a specific user."
        )
        .setDMPermission(false)
        .addSubcommand((option) =>
            option
                .setName("increase")
                .setDescription("Increase someone's points.")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("Select the user.")
                        .setRequired(true)
                )
                .addNumberOption((option) =>
                    option
                        .setName("points")
                        .setDescription(
                            "State how many points do you wanna give to the user."
                        )
                        .setMinValue(0)
                        .setMaxValue(25)
                        .setRequired(true)
                )
        )
        .addSubcommand((option) =>
            option
                .setName("decrease")
                .setDescription("decrease's someone's points.")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("Select the user.")
                        .setRequired(true)
                )
                .addNumberOption((option) =>
                    option
                        .setName("points")
                        .setDescription(
                            "State how many points you wanna remove from the user."
                        )
                        .setMinValue(0)
                        .setMaxValue(25)
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: any, client: any) {
        const { options } = interaction;


        
        //Increase
        if (options.getSubcommand() === "increase") {
            const { member, guild } = interaction;
            const e = options.getUser("user");
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
            const points = options.getNumber("points");

            const userPoints = await pointsSchema.findOne({ userId: user.id, guildId: guild.id });
            const Bots = guild.members.cache.get(user.id);
            if (Bots.user.bot) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:x: Bots cannot have any points.***");
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            let addedPoints;

            try {
                if (userPoints) {
                    addedPoints = userPoints.points += points;
                    await userPoints.save();
                } else {
                    await pointsSchema.create({
                        userId: user.id,
                        guildId: guild.id,
                        points: points,
                    });
                }

                const embed = new EmbedBuilder()
                    .setDescription(`✅ <@${user.id}> has got ***${points}P*** `)
                    .setFooter({
                        text: `User's points: ${addedPoints || points}P`,
                        iconURL: user.user.avatarURL(),
                    })
                    .setColor("Green");
                return await interaction.reply({ embeds: [embed] });
            } catch (err) {
                return;
            }
        }



        //Decrease
        else if (options.getSubcommand() === "decrease") {
            const { guild } = interaction;
            const e = options.getUser("user");
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
            const points = options.getNumber("points");
            const member = guild.members.cache.get(user.id);
            if (member.user.bot) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:x: Bots cannot have any points.***");
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const userPoints = await pointsSchema.findOne({
                userId: user.id,
                guildId: guild.id,
            });

            try {
                if (!userPoints) {
                    const noPoints = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            "***:warning: The user you mentioned doesn't have any points.***"
                        );
                    return await interaction.reply({ embeds: [noPoints], ephemeral: true });
                } else {
                    if (userPoints.points < points) {
                        const lessPoints = new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(
                                `***:warning: The mentioned user doesn't have that many points (User's points: ${userPoints.points}).***`
                            );
                        return await interaction.reply({
                            embeds: [lessPoints],
                            ephemeral: true,
                        });
                    }
                    let removedPoints;

                    removedPoints = userPoints.points -= points;
                    await userPoints.save();

                    const embed = new EmbedBuilder()
                        .setDescription(`✅ <@${user.id}> now has ***${points}P*** deducted`)
                        .setFooter({
                            text: `User's points: ${removedPoints || points}P`,
                            iconURL: user.user.avatarURL(),
                        })
                        .setColor("Green");
                    return await interaction.reply({ embeds: [embed] });
                }
            } catch (err) {
                return;
            }
        }
    },
};