const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js");
const joinRoleSchema = require("../../schemas/joinRoleSchema.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autorole")
        .setDescription("Autoroles.")
        .setDMPermission(false)
        .addSubcommand((c) =>
            c
                .setName("join")
                .setDescription("What should be the autorole upon joining?")
                .addRoleOption((r) =>
                    r
                        .setName("role")
                        .setDescription("Select the role.")
                        .setRequired(true)
                )
        ),
    async execute(interaction, client) {
        const { options, guild, member } = interaction;

        if (options.getSubcommand() === "join") {
            const getRole = options.getRole("role")
            const role = guild.roles.cache.get(getRole.id);

            const data = await joinRoleSchema.findOne({ guildId: guild.id });

            if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const permissionEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(
                        "***:warning: You don't have the permission `Administrator` to use this Command.***"
                    );

                return interaction.reply({
                    embeds: [permissionEmbed],
                    ephemeral: true,
                });
            }
            if (data) {
                const button = new ButtonBuilder()
                    .setCustomId("joinrolebtn")
                    .setLabel("Remove role?")
                    .setStyle(ButtonStyle.Primary);
                const row = new ActionRowBuilder().addComponents(button)

                const embed = new EmbedBuilder()
                    .setTitle("A role is already chosen!")
                    .setDescription("A role is already chosen as the autorole for join!")
                    .setColor("Red")
                interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
            } else {
                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`***:white_check_mark: Successully made ${role.name} as the automatic join role.***`)
                await interaction.reply({ embeds: [embed], ephemeral: true });

                try {
                    await new joinRoleSchema({
                        guildId: guild.id,
                        roleId: role.id
                    }).save();
                } catch(err) {
                    return;
                }
            }
        }
    }
}
