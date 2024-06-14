//Imports
import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-nickname")
        .setDescription("Changes/sets nickname of a specific user.")
        .setDMPermission(false)
        .addUserOption((user) =>
            user.setName("user").setDescription("Select the user.").setRequired(true)
        )
        .addStringOption((nick) =>
            nick
                .setName("nickname")
                .setDescription("What should be the nickname?")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
    async execute(interaction: any, client: any) {
        const { options } = interaction;

        //Variables
        const user = options.getMember("user");
        const nickname = options.getString("nickname");

        if (nickname.length > 32) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("***:warning: You cannot use more then 32 characters!***")
            return await interaction.reply({ embeds: [embed], ephemeral: true })
        } else {
            try {
                await user.setNickname(nickname);

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`***:white_check_mark: Successfully changed ${user.user.username}'s nickname to "${nickname}"***`)
                return await interaction.reply({ embeds: [embed] })
            } catch (e) {
                console.log(e)
            }
        }
    },
};
