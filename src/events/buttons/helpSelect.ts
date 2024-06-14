import { EmbedBuilder } from "discord.js";

module.exports = {
    name: "interactionCreate",
    async execute(interaction: any, client: any) {
        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId === "helpSelect") {
            if (interaction.values[0] === "faqs") {
                const embed = new EmbedBuilder()
                    .setTitle("FAQs")
                    .setColor("White")
                    .setDescription("The following are the Faqs answered by the Developer/Owner.")
                    .addFields([
                        { name: "Where is the support server?", value: "A: https://discord.gg/mjMKFQDDaD" },
                        { name: "What is Application did not respond?", value: "A: It means the command you're trying to use has some error. Most of the times it is because the bot is offline <:invisible_offline_blank:1234893868562907259>." },
                        { name: "What is \"Something went wrong while executing this command\"?", value: "A: It means the command has an error, it might take time for the command to get fixed. Join the Support server to stay updated." },
                        { name: "Can this bot prevent alts, racial slurs or raids?", value: "A: No, this bot does not have alt detection or raid prevention. We recommend using automod feature for this." },
                        { name: "How can I suggest or complain about something?", value: "A: Join our support server." },
                        { name: "When will the Bot have it's own website?", value: "A: Maybe soon?" },
                    ])
                interaction.reply({ embeds: [embed], ephemeral: true });

            } else if (interaction.values[0] === "moderation") {
                const embed = new EmbedBuilder()
                    .setTitle("Moderation")
                    .setColor("White")
                    .setDescription("The following are the moderation commands of this bot!")
                    .addFields([
                        { name: "/ban", value: "Bans people from the server permanently." },
                        { name: "/tempban", value: "Bans people from the server for a temporary time."},
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
                    .setColor("White")
                    .setDescription("The following are the community commands of this bot!")
                    .addFields([
                        { name: "/afk", value: "Go afk with it."},
                        { name: "/event", value: "Hosts events!" },
                        { name: "/membercount", value: "Counts the total amount of members in the server." },
                        { name: "/server-info", value: "Gives information about the server." },
                        { name: "/user-info", value: "Gives information about the user you select." },
                        { name: "/avatar", value: "Shows you the profile/icon of a user or the server." },
                        { name: "/points", value: "Information about a user's points or, add or remove points | Subcmds: increase, decrease, info."},
                        { name: "/points-leaderboard", value: "Leaderboard of users from most points to lowest."},
                    ])
                interaction.reply({ embeds: [embed], ephemeral: true });
            } else if (interaction.values[0] === "management") {
                const embed = new EmbedBuilder()
                    .setTitle("Management")
                    .setColor("White")
                    .setDescription("The following are the management commands of this bot!")
                    .addFields([
                        { name: "/auto-publish", value: "Starts automatically publishing announcements. It has 2 subcommands:- add, remove." },
                        { name: "/autorole", value: "Starts automatically giving roles to someone. It has 1 subcommand: - join (Gives person a role once they join the server)." },
                        { name: "/embed", value: "Sends an embed in a specific channel" },
                        { name: "/reactionroles", value: "Sends an embed to a channel with buttons. You can get your roles thrugh the buttons." },
                        { name: "/slowmode", value: "Sets or removes a slowmode for a channel." },
                        { name: "/event-hostrole", value: "Sets your host role."},
                    ])
                interaction.reply({ embeds: [embed], ephemeral: true });
            } else if (interaction.values[0] === "dev") {
                const embed = new EmbedBuilder()
                    .setTitle("Dev")
                    .setColor("White")
                    .setDescription("The following are the Developer commands of this bot!")
                    .addFields([
                        { name: "/invite", value: "Returns an embed with a button with which you can invite the bot." },
                        { name: "/ping", value: "Shows API Latency and Client Latency of the bot." },
                        { name: "/stats", value: "Shows the statistics of the bot like how many servers the bot is in and others." }
                    ])
                interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
}