const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const eventRoleSchema = require("../../schemas/eventsRoleSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("host-role")
        .setDescription("What should be the role required to host an event?")
        .addRoleOption((r) =>
            r
                .setName("role")
                .setDescription("Choose the role.")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const { options, guild, member } = interaction;
        const getRole = options.getRole("role")
        const role = guild.roles.cache.get(getRole.id);

        const data = await eventRoleSchema.findOne({ guildId: guild.id });

        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("***:warning: You don't have the permission `Administrator` to run this command***")
            interaction.reply({ embeds: [embed], ephemeral: true })
        }

        if (!data || !data.roleId) {
            const embed = new EmbedBuilder()
                .setTitle("Role chosen")
                .setDescription(`The role \`${role.name}\` has been successfully selected as the role required to host.`)
                .setColor("Green")
            interaction.reply({ embeds: [embed], ephemeral: true });

            await new eventRoleSchema({
                guildId: guild.id,
                roleId: role.id
            }).save();
        } else {
            const button = new ButtonBuilder()
                .setCustomId("hostrolebtn")
                .setLabel("Remove role?")
                .setStyle(ButtonStyle.Primary);
            const row = new ActionRowBuilder().addComponents(button)

            const embed = new EmbedBuilder()
                .setTitle("A is already chosen!")
                .setDescription("A role is already chosen as the role required to host in this server!")
                .setColor("Red")
            interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
        }
    }
}