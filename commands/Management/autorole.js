//Imports
const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    PermissionFlagsBits
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
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const { options, guild, member } = interaction;

        //Join Subcommand
        if (options.getSubcommand() === "join") {
            const getRole = options.getRole("role")
            const role = guild.roles.cache.get(getRole.id);

            //Data
            const data = await joinRoleSchema.findOne({ guildId: guild.id });
            //If there is no data
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
                return await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
            //Else if there is data
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
