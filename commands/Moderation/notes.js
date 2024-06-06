//Imports
const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    PermissionFlagsBits
} = require("discord.js");
const modNotesSchema = require("../../schemas/modNotesSchema.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mod-notes")
        .setDescription("Check your notes or other mod's notes.")
        .setDMPermission(false)
        .addUserOption((moderator) =>
            moderator.setName("moderator").setDescription("Select the Moderator.")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        const { options, guild } = interaction;
        
        //Variables
        const moderator = options.getMember("moderator") || interaction.user;
        const userInGuild = guild.members.cache.get(moderator.id);
        let notesBoard = ``
        const page = 1;
        const notesPerPage = 5;
        const notesToSkip = (page - 1) * notesPerPage;

        //Data
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

        if (!userInGuild.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("***:warning: The user must be a moderator/staff in the server.***")
            return await interaction.reply({ embeds: [embed], ephemeral: true })
        }

        const noNotes = new EmbedBuilder()
            .setDescription(
                `***:warning: ${moderator.username || moderator.user.username
                } has no notes.***`
            )
            .setColor("Red");
        if (data.length < 1)
            return await interaction.reply({ embeds: [noNotes] });

        //Buttons
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
        return await interaction.reply({ embeds: [embed], components: [row] });
    }
};
