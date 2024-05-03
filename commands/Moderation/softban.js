const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const ms = require("ms")
const softbanSchema = require("../../schemas/softbanSchema.js");
const softbanRoleSchema = require("../../schemas/softbanRoleSchema.js");

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
            const softbanRoleData = await softbanRoleSchema.findOne({
                guildId: guild.id,
            });
            if (!softbanRoleData) {
                const button = new ButtonBuilder()
                    .setCustomId("softban")
                    .setLabel("Create role?")
                    .setStyle(ButtonStyle.Primary)
                const row = new ActionRowBuilder().addComponents(button);
2
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(
                        "***:warning: No `softban` role for this command to be executed!***"
                    );

                await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
            }
            const role = guild.roles.cache.get(softbanRoleData.roleId);
            console.log(softbanRoleData.roleId)
            if (!role) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(
                        "***:warning: No role assigned for this command to be executed.***"
                    );

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const data = await softbanSchema.findOne({
                guildId: guild.id,
                userId: banUser.id,
            });

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

            if (banMember.roles.cache.has(role.id)) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:x: The user is already softbanned.***");
                return await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }

            if (!banMember.roles.cache.has(role.id)) {
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
                    return;
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
                    .setFooter({ iconURL: "https://cdn.discordapp.com/emojis/1233294833389539390.webp?size=80&quality=lossless", text: "Softban makes a user unable to see most channels" })
                await interaction.reply({ embeds: [embed] });

                await banMember.roles.add(role);

                if (!data) {
                    new softbanSchema({
                        guildId: guild.id,
                        userId: banUser.id,
                        duration: duration,
                    }).save();
                }
            }

            setTimeout(async() => {
                banMember.roles.remove(role)
                await softbanSchema.deleteOne({ userId: banUser.id, guildId: guild.id })
            }, ms(duration || data.duration))
        } catch (err) {
            return;
        }
    }
}