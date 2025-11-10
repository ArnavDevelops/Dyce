//Imports
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ApplicationCommandOptionType, InteractionContextType } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "userinfo",
  description: "Information about the user",
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "user",
      description: "Select the user or leave it to see your own",
      type: ApplicationCommandOptionType.User,
    },
  ],
  run: async ({ interaction, client, args }) => {
    
    const { guild } = interaction;
    const user = await client.users.fetch(args.getUser("user") || interaction.user, { force: true })
    const member = await guild.members.fetch(user);
    const username = user.username;
    const avatar = user.avatarURL();
    const joined = member.joinedAt;
    const created = user.createdAt;

    //Buttons
    const button = new ButtonBuilder()
      .setCustomId(`member_roles-${user.id}`)
      .setLabel("View Roles")
      .setEmoji("💁")
      .setStyle(ButtonStyle.Primary);

    const button2 = new ButtonBuilder()
      .setCustomId(`badges-${user.id}`)
      .setLabel("View Badges")
      .setEmoji("🔰")
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder().addComponents(button, button2);

    //Modifying status strings
    let status =
      member.presence?.status || "<:invisible_offline_blank:1234893868562907259> Offline/Invisible"
    if (status === "dnd") {
      status = "<:dnd_blank:1234902957129072741> Do not Disturb";
    }
    if (status === "idle") {
      status = "<:Idle:1234902778472824877> Idle";
    }
    if (status === "online") {
      status = "<:online_blank:1234902595940778045> Online";
    }

    //Embed
    const embed = new EmbedBuilder()
      .setTitle("User Information")
      .addFields({ name: "Username", value: `${username}`, inline: true })
      .addFields({ name: "User ID", value: `${user.id}`, inline: true })
      .addFields({ name: "Status", value: `${status}` })
      .addFields({
        name: "Joined Server on",
        value: `<t:${Math.floor(joined.getTime() / 1000)}:F>`,
      })
      .addFields({
        name: "Joined Discord on",
        value: `<t:${Math.floor(created.getTime() / 1000)}:F>`,
      })
      .setThumbnail(avatar)
      .setColor(user.accentColor);
    return await interaction.reply({ embeds: [embed], components: [row.toJSON()] });
  },
});
