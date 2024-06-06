//Imports
const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    PermissionFlagsBits
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
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const { member, options, guild } = interaction;

        //Variables
        const role1 = guild.roles.cache.get(options.getRole("role1").id)
        const role2 = guild.roles.cache.get(options.getRole("role2").id)
        const role3 = options.getRole("role3") ? guild.roles.cache.get(options.getRole("role3").id) : null;
        const role4 = options.getRole("role4") ? guild.roles.cache.get(options.getRole("role4").id) : null;
        const channel = guild.channels.cache.get(options.getChannel("channel").id)
        let row = new ActionRowBuilder()

        //Buttons
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
        const deleteBtn = new ButtonBuilder()
            .setCustomId("rrdelete")
            .setLabel("Delete")
            .setStyle(ButtonStyle.Danger);
        row.addComponents(role1btn, role2btn, deleteBtn);

        //Embed
        const embed = new EmbedBuilder()
            .setTitle("Reaction Roles")
            .setDescription("***<:info:1233294833389539390> Click one or more of the buttons to get the role of your choice!***");
        const msg = await channel.send({ embeds: [embed], components: [row], ephemeral: true });
        await interaction.reply({ content: `Successfully sent the embed to <#${channel.id}>`, ephemeral: true })

        //Make Data
        try {
            await new reactionRolesSchema({
                guildId: guild.id,
                channelId: channel.id,
                msgId: msg.id,
                role1: role1.id,
                role2: role2.id,
                role3: role3 ? role3.id : "None",
                role4: role4 ? role4.id : "None",
            }).save()
        } catch (err) {
            return;
        }
    }
}