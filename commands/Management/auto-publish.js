const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ChannelType
} = require("discord.js");
const autoPublishSchema = require("../../schemas/autoPublishSchema.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autopublish")
        .setDescription("Auto publishes announcements to other servers.")
        .setDMPermission(false)
        .addSubcommand((c) =>
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
        .addSubcommand((c) =>
            c
                .setName("remove")
                .setDescription("Which channel should not have autopublishing?")
                .addChannelOption((c) =>
                    c
                        .setName("channel")
                        .setDescription("Select the channel")
                        .setRequired(true)
                )
        ),
    async execute(interaction, client) {
        const { options, guild, member } = interaction;

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

        if (options.getSubcommand() === "add") {
            const channel = guild.channels.cache.get(options.getChannel("channel").id);
            if (channel.type !== ChannelType.GuildAnnouncement) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:warning: The channel you selected is not an Announcement channel.***")
                return await interaction.reply({ embeds: [embed], ephemeral: true })
            }

            const data = await autoPublishSchema.findOne({ guildId: guild.id, channelId: channel.id });

            if (!data) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`***:white_check_mark: Successfully selected ${channel.name} for autopublishing.***`)
                    .setFooter({ text: "Tip: use a period/full stop punctuation at the start of your message to prevent autopublish.", iconURL: "https://cdn.discordapp.com/emojis/1233294833389539390.webp?size=128&quality=lossless" })
                await interaction.reply({ embeds: [embed], ephemeral: true });

                new autoPublishSchema({
                    guildId: guild.id,
                    channelId: channel.id
                }).save();
            } else {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:warning: This channel is already setup for autopublishing.***")
                interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } else if (options.getSubcommand() == "remove") {
            const channel = guild.channels.cache.get(options.getChannel("channel").id);
            if (channel.type !== ChannelType.GuildAnnouncement) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***:warning: The channel you selected is not an Announcement channel.***")
                return await interaction.reply({ embeds: [embed], ephemeral: true })
            }

            const data = await autoPublishSchema.findOne({ guildId: guild.id, channelId: channel.id });

            if (!data) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("***The channel you selected has not been setup for autopublishing.***")
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`***:white_check_mark: Successfully removed ${channel.name} for autopublishing.***`)
                interaction.reply({ embeds: [embed], ephemeral: true });

                await autoPublishSchema.findOneAndDelete({ guildId: guild.id, channelId: channel.id })
            }
        }
    }
}