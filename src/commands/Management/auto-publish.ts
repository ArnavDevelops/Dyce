import { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } from "discord.js";
import autoPublishSchema from "../../schemas/autoPublishSchema"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autopublish")
        .setDescription("Auto publishes announcements to other servers.")
        .setDMPermission(false)
        .addSubcommand((c) => //Subcommand to autopublish channel
            c
                .setName("add")
                .setDescription("What should be the channel for autopublishing??")
                .addChannelOption((r) =>
                    r
                        .setName("channel")
                        .setDescription("Select the channel.")
                        .setRequired(true)
                )
        )
        .addSubcommand((c) => //Subcommand to remove an already autopublishing channel
            c
                .setName("remove")
                .setDescription("Which channel should not have autopublishing?")
                .addChannelOption((c) =>
                    c
                        .setName("channel")
                        .setDescription("Select the channel")
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: any, client: any) {
        const { options, guild } = interaction;

        //Add subcommand
        if (options.getSubcommand() === "add") {
            const channel = guild.channels.cache.get(options.getChannel("channel").id);
            if (channel.type !== ChannelType.GuildAnnouncement) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:warning: The channel you selected is not an Announcement channel.***")
                return await interaction.reply({ embeds: [embed], ephemeral: true })
            }

            //Data
            const data = await autoPublishSchema.findOne({ guildId: guild.id, channelId: channel.id });

            //If there is no data
            if (!data) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`***:white_check_mark: Successfully selected ${channel.name} for autopublishing.***`)
                    .setFooter({ text: "Tip: use a period/full stop punctuation at the start of your message to prevent autopublish.", iconURL: "https://cdn.discordapp.com/emojis/1233294833389539390.webp?size=128&quality=lossless" })
                await interaction.reply({ embeds: [embed], ephemeral: true });

                try {
                    new autoPublishSchema({
                        guildId: guild.id,
                        channelId: channel.id
                    }).save();
                } catch(err) {
                    return;
                }
            //Else if there is data
            } else {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:warning: This channel is already setup for autopublishing.***")
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        //Remove subcommand
        } else if (options.getSubcommand() == "remove") {
            const channel = guild.channels.cache.get(options.getChannel("channel").id);
            if (channel.type !== ChannelType.GuildAnnouncement) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:warning: The channel you selected is not an Announcement channel.***")
                return await interaction.reply({ embeds: [embed], ephemeral: true })
            }

            //Data
            const data = await autoPublishSchema.findOne({ guildId: guild.id, channelId: channel.id });
            //If there is no data
            if (!data) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***The channel you selected has not been setup for autopublishing.***")
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            //Else if there is a data
            } else {
                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`***:white_check_mark: Successfully removed ${channel.name} for autopublishing.***`)
                interaction.reply({ embeds: [embed], ephemeral: true });

                try {
                    await autoPublishSchema.findOneAndDelete({ guildId: guild.id, channelId: channel.id })
                } catch(err) {
                    return;
                }
            }
        }
    }
}