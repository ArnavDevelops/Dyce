//Imports
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } from "discord.js";
import reactionRolesSchema from "../../schemas/reactionRolesSchema"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reactionroles")
        .setDescription("Sends an reaction role embed to a channel with buttons in it.")
        .setDMPermission(false)
        .addChannelOption((c) =>
            c
                .setName("channel")
                .setDescription("Channel to send the embed in.")
                .setRequired(true)
        )
        .addRoleOption((r) =>
            r
                .setName("role1")
                .setDescription("First role.")
                .setRequired(true)
        )
        .addRoleOption((r) =>
            r
                .setName("role2")
                .setDescription("Second role.")
                .setRequired(true)
        )
        .addStringOption((s) =>
            s
                .setName("message1")
                .setDescription("What should be the description of the first role? (Recommandation: start with emoji)")
                .setRequired(true)
        )
        .addStringOption((s) =>
            s
                .setName("message2")
                .setDescription("What should be the description of the second role? (Recommandation: start with emoji)")
                .setRequired(true)
        )
        .addRoleOption((r) =>
            r
                .setName("role3")
                .setDescription("Third role.")
        )
        .addStringOption((s) =>
            s
                .setName("message3")
                .setDescription("What should be the description of the third role? (Recommandation: start with emoji)")
        )
        .addRoleOption((r) =>
            r
                .setName("role4")
                .setDescription("Fourth role.")
        )
        .addStringOption((s) =>
            s
                .setName("message4")
                .setDescription("What should be the description of the fourth role? (Recommandation: start with emoji)")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: any, client: any) {
        const { member, options, guild } = interaction;

        //Variables
        const role1 = guild.roles.cache.get(options.getRole("role1").id)
        const role2 = guild.roles.cache.get(options.getRole("role2").id)
        const role3 = options.getRole("role3") ? guild.roles.cache.get(options.getRole("role3").id) : null;
        const role4 = options.getRole("role4") ? guild.roles.cache.get(options.getRole("role4").id) : null;
        const message1 = options.getString("message1")
        const message2 = options.getString("message2")
        const message3 = options.getString("message3")
        const message4 = options.getString("message4")
        const channel = guild.channels.cache.get(options.getChannel("channel").id)
        let row = new ActionRowBuilder()

        const embed = new EmbedBuilder()
            .setTitle("Reaction Roles")
            .setDescription("***<:info:1233294833389539390> Click one or more of the buttons to get the role of your choice!***")
            .addFields({ name: role1.name, value: message1 })
            .addFields({ name: role2.name, value: message2 })

        //Buttons
        const role1btn = new ButtonBuilder()
            .setCustomId("role1")
            .setLabel(role1.name)
            .setStyle(ButtonStyle.Primary);
        const role2btn = new ButtonBuilder()
            .setCustomId("role2")
            .setLabel(role2.name)
            .setStyle(ButtonStyle.Primary);
        if (role3) {
            const role3btn = new ButtonBuilder()
                .setCustomId("role3")
                .setLabel(role3.name)
                .setStyle(ButtonStyle.Primary);

            embed.addFields({ name: role3.name, value: message3 })
            row.addComponents(role3btn);

            if (role4) {
                const role4btn = new ButtonBuilder()
                    .setCustomId("role4")
                    .setLabel(role4.name)
                    .setStyle(ButtonStyle.Primary);

                embed.addFields({ name: role4.name, value: message4 })
                row.addComponents(role4btn);
            }
        } else if(role4) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("***:warning: Select role3 first in order to use role4***")
            return await interaction.reply({ embeds: [embed], ephemeral: true })
        }
        
        const deleteBtn = new ButtonBuilder()
            .setCustomId("rrdelete")
            .setLabel("Delete")
            .setStyle(ButtonStyle.Danger);
        row.addComponents(role1btn, role2btn, deleteBtn);

        //Embed
        const msg = await channel.send({ embeds: [embed], components: [row], ephemeral: true });
        await interaction.reply({ content: `Successfully sent the embed to <#${channel.id}>`, ephemeral: true })

        //Make Data
        try {
            await new reactionRolesSchema({
                guildId: guild.id,
                channelId: channel.id,
                msgId: msg.id,
                role1: role1.id,
                role2: role2.id,
                role3: role3 ? role3.id : "None",
                role4: role4 ? role4.id : "None",
            }).save()
        } catch (err) {
            return;
        }
    }
}