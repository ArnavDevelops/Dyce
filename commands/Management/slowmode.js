//Imports
const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("Sets a slowmode for a channel.")
        .setDMPermission(false)
        .addChannelOption((c) =>
            c
                .setName("channel")
                .setDescription("Select the channel.")
                .setRequired(true)
        )
        .addNumberOption((n) =>
            n
                .setName("duration")
                .setDescription("Insert how long the slowmode should be in seconds")
                .setRequired(true)
                .setMaxValue(21600)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const { options, guild } = interaction;

        //Variables
        let content = ``;
        let durationContent = ""
        const channel = guild.channels.cache.get(options.getChannel("channel").id)
        const duration = options.getNumber("duration")

        //Converting seconds into hours or minutes
        if (duration >= 3600) {
            durationContent += `${Math.floor(duration / 3600)} hour(s)`
        } else if (duration >= 60) {
            durationContent += `${Math.floor(duration % 3600 / 60)} minute(s)`
        } else if (duration <= 60) {
            durationContent += `${duration} second(s)`
        }

        //Checking weather the channel's slowmode is equal to the duration
        if (channel.rateLimitPerUser == duration) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`***:warning: The channel (#${channel.name}) already has ${durationContent} of slowmode. Choose a different number.***`)
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            if (duration == 0) {
                content += `***:white_check_mark: The channel (#${channel.name}) now has no duration at all.***`
            } else if (duration >= 0) {
                content += `***:white_check_mark: The channel (#${channel.name}) now has ${durationContent} of slowmode***`
            }

            try {
                channel.setRateLimitPerUser(duration)

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(content)
                return await interaction.reply({ embeds: [embed] })
            } catch (err) {
                return;
            }
        }
    }
}