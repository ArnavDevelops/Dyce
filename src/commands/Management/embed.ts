//Imports
import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Builds an embed - Doesn't support fields")
        .setDMPermission(false)
        .addChannelOption((c) =>
            c
                .setName("channel")
                .setDescription("Select the channel where the embed should be posted")
                .setRequired(true)
        )
        .addStringOption((s) =>
            s
                .setName("title")
                .setDescription("What should be the title of the embed?")
                .setRequired(true)
        )
        .addStringOption((s) =>
            s
                .setName("description")
                .setDescription("What should be the description of the embed?")
                .setRequired(true)
        )
        .addAttachmentOption((i) =>
            i
                .setName("image")
                .setDescription("What should be the image of the embed?")
                .setRequired(false)
        )
        .addAttachmentOption((i) =>
            i
                .setName("icon")
                .setDescription("What should be the thumbnail/icon of the embed?")
                .setRequired(false)
        )
        .addStringOption((s) =>
            s
                .setName("colour")
                .setDescription("What should be the color of the embed?")
                .addChoices(
                    { name: "Red", value: "Red" },
                    { name: "Blue", value: "Blue" },
                    { name: "Pink", value: "Pink" },
                    { name: "Green", value: "Green" },
                    { name: "Yellow", value: "Yellow" },
                    { name: "Purple", value: "Purple" },
                    { name: "Orange", value: "Orange" },
                    { name: "Black (Default)", value: "Black" },
                    { name: "Aqua", value: "Aqua" },
                    { name: "Random", value: "Random" },
                    { name: "Navy", value: "Navy" },
                    { name: "Grey", value: "Grey" },
                    { name: "Dark Blue", value: "DarkBlue" },
                )
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: any, client: any) {
        const { options, guild, member } = interaction;

        //Variables
        const title = options.getString("title")
        const description = options.getString("description")
        const colour = options.getString("colour")
        const image = options.getAttachment("image")
        const thumbnail = options.getAttachment("icon")
        const channel = guild.channels.cache.get(options.getChannel("channel").id)

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)

        if (colour) {
            embed.setColor(colour)
        }

        if (thumbnail) {
            embed.setThumbnail(thumbnail.url)
        }

        if (image) {
            embed.setImage(image.url)
        }

        const reply = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`:white_check_mark: **Successfully sent the embed to ${channel}**`)

        await channel.send({ embeds: [embed] })
        return await interaction.reply({ embeds: [reply], ephemeral: true })
    }
}
