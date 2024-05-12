const {
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId === "helpSelect") {
            if (interaction.values[0] === "faqs") {
                const embed = new EmbedBuilder()
                    .setTitle("FAQs")
                    .setDescription("The following are the Faqs answered by the Developer/Owner.")
                    .addFields([
                        { name: "Where is the support server?", value: "A: https://discord.gg/mjMKFQDDaD" },
                        { name: "Ping?", value: "A: We don't really have ping command as it doesn't matter (not used by many people)." },
                        { name: "What is Application did not respond?", value: "A: It means the command you're trying to use has some error. Most of the times it is because the bot is offline <:invisible_offline_blank:1234893868562907259>." },
                        { name: "What is \"Something went wrong while executing this command\"?", value: "A: It means the command has an error, it might take time for the command to get fixed. Join the Support server to stay updated." },
                        { name: "Can this bot prevent alts, racial slurs or raids?", value: "A: No, this bot does not have alt detection or raid prevention. We recommend using automod feature for this." },
                        { name: "How can I suggest or complain about something?", value: "A: Join our support server." },
                        { name: "When will the Bot website release?", value: "A: It may take a huge time.." },
                    ])
                interaction.reply({ embeds: [embed], ephemeral: true });

            } else if (interaction.values[0] === "moderation") {
                const embed = new EmbedBuilder()
                    .setTitle("Moderation")
                    .setDescription("The following are the moderation commands of this bot!")
                    .addFields([
                        { name: "/ban", value: "Bans people from the server permanently." },
                        { name: "/unban", value: "Vice versa of /ban, It unbans people who have been banned from the server." },
                        { name: "/kick", value: "Kicks a member from the server." },
                        { name: "/lock", value: "Locks a channel." },
                        { name: "/unlock", value: "Vice versa of /lock. Unlocks a channel." },
                        { name: "/notes", value: "Stores every notes left by Moderators when taking action." },
                        { name: "/purge", value: "Deletes a bunch of messages." },
                        { name: "/role", value: "Can remove, give or replace someone's role or give everyone a role." },
                        { name: "/softban", value: "Makes someone unable to see most channels using softban role (You need to manage the role's permissions in the channels by yourself though)." },
                        { name: "/timeout", value: "Timeouts someone in the server for a specific period of time." },
                        { name: "/untimeout", value: "Vice versa of timeout. Untimeouts people." },
                        { name: "/warn", value: "Warns someone and saves their warning." },
                        { name: "/warn-remove", value: "Removes one or many warnings." },
                        { name: "/warnings", value: "Shows your or someone's warnings. Even normal members can use it." }
                    ])
                interaction.reply({ embeds: [embed], ephemeral: true });

            } else if (interaction.values[0] === "community") {
                const embed = new EmbedBuilder()
                    .setTitle("Community")
                    .setDescription("The following are the community commands of this bot!")
                    .addFields([
                        { name: "/host", value: "Hosts events!" },
                        { name: "/membercount", value: "Counts the total amount of members in the server." },
                        { name: "/server-info", value: "Gives information about the server." },
                        { name: "/user-info", value: "Gives information about the user you select." },
                        { name: "/avatar", value: "Shows you the profile/icon of a user or the server." }
                    ])
                interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
}