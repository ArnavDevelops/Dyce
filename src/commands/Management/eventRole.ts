//Import
import eventRoleSchema from "../../schemas/eventsRoleSchema"
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("event-hostrole")
        .setDescription("What should be the role required to host an event?")
        .addRoleOption((r) =>
            r
                .setName("role")
                .setDescription("Choose the role.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction: any, client: any) {
        const { options, guild, member } = interaction;
        const getRole = options.getRole("role")
        const role = guild.roles.cache.get(getRole.id);

        try {
            //Getting the Data
            const data = await eventRoleSchema.findOne({ guildId: guild.id });

            //If there is no data or a roleId
            if (!data || !data.roleId) {
                const embed = new EmbedBuilder()
                    .setTitle("Role chosen")
                    .setDescription(`The role \`${role.name}\` has been successfully selected as the role required to host.`)
                    .setColor("Green")
                interaction.reply({ embeds: [embed], ephemeral: true });

                return await new eventRoleSchema({
                    guildId: guild.id,
                    roleId: role.id
                }).save();
            //Else if there is a data
            } else { 
                //Button
                const button = new ButtonBuilder()
                    .setCustomId("hostrolebtn")
                    .setLabel("Remove role?")
                    .setStyle(ButtonStyle.Primary);
                const row = new ActionRowBuilder().addComponents(button)

                //Embed
                const embed = new EmbedBuilder()
                    .setTitle("A is already chosen!")
                    .setDescription("A role is already chosen as the role required to host in this server!")
                    .setColor("Red")
                interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
            }
        } catch (err) {
            return;
        }
    }
}