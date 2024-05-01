const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const ms = require("ms")
const softbanSchema = require("../../schemas/softbanSchema.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("softban")
        .setDescription("Makes someone unable to view most channels permanently or temporary.")
        .setDMPermission(false)
        .addUserOption((user) =>
            user.setName("user").setDescription("Select the user.").setRequired(true)
        )
        .addStringOption((reason) =>
            reason
                .setName("reason")
                .setDescription("Please provide a reason for it.")
                .setRequired(true)
        )
        .addStringOption((duration) =>
            duration
                .setName("duration")
                .setDescription("Choose a duration for it.")
                .setRequired(true)
                .addChoices(
                    { name: "60 Seconds", value: "1m" },
                    { name: "2 Minutes", value: "2m" },
                    { name: "5 Minutes", value: "5m" },
                    { name: "10 Minutes", value: "10m" },
                    { name: "15 Minutes", value: "15m" },
                    { name: "20 Minutes", value: "20m" },
                    { name: "30 Minutes", value: "30m" },
                    { name: "45 Minutes", value: "45m" },
                    { name: "1 Hour", value: "1h" },
                    { name: "2 Hours", value: "2h" },
                    { name: "3 Hours", value: "3h" },
                    { name: "5 Hours", value: "5h" },
                    { name: "10 hours", value: "10h" },
                    { name: "1 Day", value: "1d" },
                    { name: "2 Days", value: "2d" },
                    { name: "3 Days", value: "3d" },
                    { name: "5 Days", value: "5d" },
                    { name: "One Week", value: "7d" }
                )
        ),
    async execute(interaction, client) {
        const { options, guild, member } = interaction;

        try {
            const banUser = options.getUser("user") || options.getUser("user").id;
            const banMember = await guild.members.fetch(banUser)
            const reason = options.getString("reason")
            const duration = options.getString("duration");
            //const data = await softbanSchema.findOne({
                //guildId: guild.id,
                //duration: ms(duration),
             //});
            //if(!data) return;
            const role = guild.roles.cache.get(r => r.name === "softban");
            if(!role) {
                const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                    "***:warning: No `softban` role for this command to be executed!***"
                ); 

                interaction.reply({ embeds: [embed], ephemeral: true})
            }
            const permission = member.permissions.has(
                PermissionsBitField.Flags.BanMembers
            );

            const permissionEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                    "***:warning: You don't have the permission `Ban Members` to use this Command.***"
                );
            if (!permission) {
                return interaction.reply({
                    embeds: [permissionEmbed],
                    ephemeral: true,
                });
            }

            if (banMember.id == member.id) {
                const cannotbanyourself = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:x: You can't ban yourself.***");
                return await interaction.reply({
                    embeds: [cannotbanyourself],
                    ephemeral: true,
                });
            }

            if (banMember.user.bot) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:x: You cannot ban bots.***");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (banMember.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                const cannotbanMods = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:x: I can't ban Moderators and Above.***");
                return await interaction.reply({
                    embeds: [cannotbanMods],
                    ephemeral: true,
                });
            }

            const dmEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                    `:warning: You have been softbanned in **${guild.name}** by ${member.user.username} for ${duration}`
                )
                .addFields({
                    name: "Reason",
                    value: `${reason}`,
                })
            await banMember.send({ embeds: [dmEmbed] }).catch((err) => {
                console.log(err)
            });

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                    `:white_check_mark: Successfully softbanned ***${banUser.username} for ${duration}***`
                )
                .addFields({
                    name: "Reason",
                    value: `${reason}`,
                })
                .setFooter({ iconURL: "https://cdn.discordapp.com/emojis/1233294833389539390.webp?size=80&quality=lossless", value: "Softban makes a user unable to see most channels" })
            await interaction.reply({ embeds: [embed] });

            await banMember.roles.add(role);

            setTimeout(function() {
                banMember.roles.remove(role)
            }), ms(duration)

            await softbanSchema.create({
                guildId: guild.id,
                userId: banUser.id,
                duration: duration,
            });
        } catch (err) {
            console.log(err)
        }
    }
}