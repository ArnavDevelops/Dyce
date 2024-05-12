const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    PermissionsBitField
} = require("discord.js");
const ModSchema = require("../../schemas/warnModel");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        const { customId, guild } = interaction;

        if (!interaction.isButton()) return;

        if (customId && customId.startsWith("warnsBoard:")) {
            let page;
            let user
            if (customId.startsWith("warnsBoard:next:")) {
                page = parseInt(customId.split(`:`)[3]) + 1;
                user = guild.members.cache.get(customId.split(`:`)[2])
            } else if (customId.startsWith(`warnsBoard:previous:`)) {
                page = parseInt(customId.split(`:`)[3]) - 1;
                user = guild.members.cache.get(customId.split(`:`)[2])
            }

            const permission = interaction.member.permissions.has(
                PermissionsBitField.Flags.ModerateMembers
            );

            const warnsPerPage = 5;
            const warnsToSkip = (page - 1) * warnsPerPage;
            const data = await ModSchema
                .find({ guildId: guild.id, userId: user.id || user.user.id})
                .limit(warnsPerPage)
                .skip(warnsToSkip);

            let warnsBoard = ``;
            let warns = warnsToSkip + 1;

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`warnsBoard:previous:${user.id}:${page}`)
                    .setLabel(`⬅️`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 1),
                new ButtonBuilder()
                    .setCustomId(`warnsBoard:next:${user.id}:${page}`)
                    .setLabel(`➡️`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(data.length < warnsPerPage)
            );

            if (permission) {
                for (const warn of data) {
                    warnsBoard += [
                        `**warn ID:** ${warn._id}`,
                        `**Date:** <t:${Math.round(warn.timestamp / 1000)}>`,
                        `**Reason:** ${warn.reason}`,
                    ].join("\n") + "\n\n";
                    warns++;
                }


                const embed = new EmbedBuilder()
                    .setTitle(`***${user.username || user.user.username}'s warnings***`)
                    .setDescription(warnsBoard)
                    .setColor("Yellow");

                await interaction.update({
                    embeds: [embed],
                    components: [row],
                });
            } else {
                for (const warn of data) {
                    warnsBoard += [
                        `**Date:** <t:${Math.round(warn.timestamp / 1000)}>`,
                        `**Reason:** ${warn.reason}`,
                    ].join("\n") + "\n\n";
                    warns++;
                }

                const embed = new EmbedBuilder()
                    .setTitle(`***${user.user.username || user.username}'s warnings***`)
                    .setDescription(warnsBoard)
                    .setColor("Yellow");

                await interaction.update({
                    embeds: [embed],
                    components: [row],
                });
            }
        }
    },
};