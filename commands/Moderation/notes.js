const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js");
const modNotesSchema = require("../../schemas/modNotesSchema.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mod-notes")
        .setDescription("Check your notes or other mod's notes.")
        .setDMPermission(false)
        .addUserOption((moderator) =>
            moderator.setName("moderator").setDescription("Select the Moderator.")
        ),
    async execute(interaction, client) {
        const { options, guild } = interaction;
        const moderator = options.getMember("moderator") || interaction.user;
        const userInGuild = guild.members.cache.get(moderator.id);

        const permission = interaction.member.permissions.has(
            PermissionsBitField.Flags.ModerateMembers
        );

        let notesBoard = ``
        const page = 1;
        const notesPerPage = 5;
        const notesToSkip = (page - 1) * notesPerPage;

        const data = await modNotesSchema
            .find({ moderatorId: moderator.id, guildId: guild.id })
            .limit(notesPerPage)
            .skip(notesToSkip);

        let notes = notesToSkip + 1;

        for (const moderator of data) {
            notesBoard += [
                `**Command:** ${moderator.command}`,
                `**Date:** <t:${Math.round(moderator.date / 1000)}>`,
                `**Note:** ${moderator.note}`,
            ].join("\n") + "\n\n";
            notes++;
        }

        const permissionEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
                "***:warning: You don't have the permission `Manage Messages` to use this Command.***"
            );
        if (!permission)
            return interaction.reply({ embeds: [permissionEmbed], ephemeral: true });

        if (!userInGuild.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("***:warning: Users without the permission `ModerateMembers` cannot run this Command.***")
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
        const noNotes = new EmbedBuilder()
            .setDescription(
                `***:warning: ${moderator.username || moderator.user.username
                } has no notes.***`
            )
            .setColor("Red");
        if (data.length < 1)
            return interaction.reply({ embeds: [noNotes] });

        const previousButton = new ButtonBuilder()
            .setCustomId(`notesBoard:previous:${moderator.id || moderator.user.id}:${page}`)
            .setLabel("⬅️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 1);

        const nextButton = new ButtonBuilder()
            .setCustomId(`notesBoard:next:${moderator.id || moderator.user.id}:${page}`)
            .setLabel("➡️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(data.length < notesPerPage);

        const row = new ActionRowBuilder().addComponents(
            previousButton,
            nextButton
        );
        const embed = new EmbedBuilder()
            .setTitle(`***${moderator.username || moderator.user.username}'s Notes***`)
            .setDescription(notesBoard)
            .setColor("Yellow");
        interaction.reply({ embeds: [embed], components: [row] });
    }
};
