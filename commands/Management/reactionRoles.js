const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js");
const reactionRolesSchema = require("../../schemas/reactionRolesSchema.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reactionroles")
        .setDescription("Sends an reaction role embed to a channel with buttons in it.")
        .setDMPermission(false)
        .addChannelOption((c) =>
            c
                .setName("channel")
                .setDescription("Channel to send the embed in.")
                .setRequired(true)
        )
        .addRoleOption((r) =>
            r
                .setName("role1")
                .setDescription("First role.")
                .setRequired(true)
        )
        .addRoleOption((r) =>
            r
                .setName("role2")
                .setDescription("Second role.")
                .setRequired(true)
        )
        .addRoleOption((r) =>
            r
                .setName("role3")
                .setDescription("Third role.")
        )
        .addRoleOption((r) =>
            r
                .setName("role4")
                .setDescription("Fourth role.")
        ),
    async execute(interaction, client) {
        const { member, options, guild } = interaction;

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

        const role1 = guild.roles.cache.get(options.getRole("role1").id)
        const role2 = guild.roles.cache.get(options.getRole("role2").id)
        const role3 = options.getRole("role3") ? guild.roles.cache.get(options.getRole("role3").id) : null;
        const role4 = options.getRole("role4") ? guild.roles.cache.get(options.getRole("role4").id) : null;

        const channel = guild.channels.cache.get(options.getChannel("channel").id)
        let row = new ActionRowBuilder()

        const role1btn = new ButtonBuilder()
            .setCustomId("role1")
            .setLabel(role1.name)
            .setStyle(ButtonStyle.Primary);
        const role2btn = new ButtonBuilder()
            .setCustomId("role2")
            .setLabel(role2.name)
            .setStyle(ButtonStyle.Primary);

        if (role3) {
            const role3btn = new ButtonBuilder()
                .setCustomId("role3")
                .setLabel(role3.name)
                .setStyle(ButtonStyle.Primary);

            row.addComponents(role3btn);
        }

        if (role4) {
            const role4btn = new ButtonBuilder()
                .setCustomId("role4")
                .setLabel(role4.name)
                .setStyle(ButtonStyle.Primary);

            row.addComponents(role4btn);
        }
        row.addComponents(role1btn, role2btn);

        const embed = new EmbedBuilder()
            .setTitle("Reaction Roles")
            .setDescription("***<:info:1233294833389539390> Click one or more of the buttons to get the role of your choice!***");
        await channel.send({ embeds: [embed], components: [row], ephemeral: true });
        interaction.reply({ content: `Successfully sent the embed to <#${channel.id}>`, ephemeral: true })

        return new reactionRolesSchema({
            guildId: guild.id,
            channelId: channel.id,
            role1: role1.id,
            role2: role2.id,
            role3: role3 ? role3.id : "None",
            role4: role4 ? role4.id : "None",
        }).save()
    }
}