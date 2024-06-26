//Imports
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Check the information about this server.")
    .setDMPermission(false),
  async execute(interaction: any, client: any) {
    const { guild } = interaction;
    const { name, ownerId, createdTimestamp, memberCount, channels } = guild;

    //Variables
    const icon = guild.iconURL();
    const banner = guild.bannerURL();
    const threads = channels.cache.filter((x: any) => x.isThread()).size;
    const textChannels = channels.cache.filter(
      (c: any) => c.type === ChannelType.GuildText
    ).size;
    const voiceChannels = channels.cache.filter(
      (c: any) => c.type === ChannelType.GuildVoice
    ).size;
    const categories = channels.cache.filter(
      (c: any) => c.type === ChannelType.GuildCategory
    ).size;
    const emojis = guild.emojis.cache.size;
    const rolesSize = guild.roles.cache.size;
    const id = guild.id;

    //Converting baseVerification from integer/number to a String
    let baseVerification = guild.verificationLevel;
    if (baseVerification == 0) baseVerification = "None";
    if (baseVerification == 1) baseVerification = "Low";
    if (baseVerification == 2) baseVerification = "Medium";
    if (baseVerification == 3) baseVerification = "High";
    if (baseVerification == 4) baseVerification = "Very High";

    //Button
    const button = new ButtonBuilder()
      .setCustomId("roles")
      .setLabel(`View Roles [${rolesSize}]`)
      .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder().addComponents(button);

    //Embed
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setAuthor({ name: name, iconURL: icon })
      .setDescription(guild.description || "No Description")
      .setThumbnail(icon)
      .setFooter({ text: `ID: ${id} | Server created` })
      .setTimestamp(createdTimestamp)
      .addFields({ name: "Server Owner", value: `<@${ownerId}>`, inline: true })
      .addFields({
        name: "Server Members",
        value: `${memberCount}`,
        inline: true,
      })
      .addFields({
        name: "Verification Level",
        value: `${baseVerification}`,
        inline: true,
      })
      .addFields({
        name: "Emoji(s)",
        value: `${emojis}`,
        inline: true,
      })
      .addFields({
        name: "Categories",
        value: `${categories}`,
        inline: true,
      })
      .addFields({
        name: "Text Channel(s)",
        value: `${textChannels}`,
        inline: true,
      })
      .addFields({
        name: "Voice Channel(s)",
        value: `${voiceChannels}`,
        inline: true,
      })
      .addFields({
        name: "Thread(s)",
        value: `${threads}`,
        inline: true,
      })
      .addFields({
        name: "Nitro stats",
        value: `Boosts: ${guild.premiumSubscriptionCount} | Tier: ${guild.premiumTier}`,
      });
    if(banner !== null && banner !== undefined) {
        embed.setImage(banner)
    }

    return await interaction.reply({ embeds: [embed], components: [row] });
  },
};
