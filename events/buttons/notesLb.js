const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    PermissionsBitField
} = require("discord.js");
const modNotesSchema = require("../../schemas/modNotesSchema");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        const { customId, guild } = interaction;

        if (!interaction.isButton()) return;

        if (customId && customId.startsWith("notesBoard:")) {
            let page;
            let moderator
            if (customId.startsWith("notesBoard:next:")) {
                page = parseInt(customId.split(`:`)[3]) + 1;
                moderator = guild.members.cache.get(customId.split(`:`)[2])
            } else if (customId.startsWith(`notesBoard:previous:`)) {
                page = parseInt(customId.split(`:`)[3]) - 1;
                moderator = guild.members.cache.get(customId.split(`:`)[2])
            }


            const permission = interaction.member.permissions.has(
                PermissionsBitField.Flags.ModerateMembers
            );

            const permissionEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                    "***:warning: You don't have the permission `Manage Messages` to use this Command.***"
                );
            if (!permission)
                return interaction.reply({ embeds: [permissionEmbed], ephemeral: true });

            const notesPerPage = 5;
            const notesToSkip = (page - 1) * notesPerPage;
            const data = await modNotesSchema
                .find({ guildId: interaction.guild.id, moderatorId: moderator.id || moderator.user.id })
                .limit(notesPerPage)
                .skip(notesToSkip);

            let notesBoard = ``;
            let notes = notesToSkip + 1;

            for (const moderator of data) {
                notesBoard += [
                    `**Command:** ${moderator.command}`,
                    `**Date:** <t:${Math.round(moderator.date / 1000)}>`,
                    `**Note:** ${moderator.note}`,
                ].join("\n") + "\n\n";
                notes++;
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`notesBoard:previous:${moderator.id || moderator.user.id}:${page}`)
                    .setLabel(`⬅️`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 1),
                new ButtonBuilder()
                    .setCustomId(`notesBoard:next:${moderator.id || moderator.user.id}:${page}`)
                    .setLabel(`➡️`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(data.length < notesPerPage)
            );

            const embed = new EmbedBuilder()
                .setTitle(`***${moderator.user.username || moderator.username}'s Notes***`)
                .setDescription(notesBoard)
                .setColor("Yellow");

            await interaction.update({
                embeds: [embed],
                components: [row],
            });
        }
    },
};