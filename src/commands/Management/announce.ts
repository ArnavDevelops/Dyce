//Imports
import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import startTyping from "../../helpers/startTyping";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("Announces a specific message in a specific channel.")
        .setDMPermission(false)
        .addChannelOption((c) =>
            c
                .setName("channel")
                .setDescription("Select the channel.")
                .setRequired(true)
        )
        .addStringOption((m) =>
            m
                .setName("message")
                .setDescription("What should be the message?")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: any, client: any) {
        const { options } = interaction;

        //Variables
        const channel = options.getChannel("channel")
        const message = options.getString("message")

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`***:white_check_mark: Successfully sent the message in #${channel.name}.***`)
        await interaction.reply({ embeds: [embed], ephemeral: true });

        try {
            startTyping(channel)
            setTimeout(async () => {
                return await channel.send(`${message}\n **Requested by: ${interaction.user.username}**`)
            }, 2000)
        } catch (e) {
            return;
        }
    },
};
