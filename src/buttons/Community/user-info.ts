import { Button } from "../../structures/Button";
import { EmbedBuilder } from "discord.js";
import { JapiDiscordUserResponse } from "../../typings/IJapiRest";

export default new Button("userinfo:", async ({ interaction, client }) => {
  const { customId } = interaction;

  if (customId.startsWith("userinfo:member_roles")) {
    const userId = customId.split("-")[1];
    const targetMember = await interaction.guild.members.fetch(userId);
    const memberRoles = targetMember.roles.cache
      .filter((r: any) => r.id !== interaction.guild.id)
      .sort((a: any, b: any) => b.position - a.position)
      .map((r: any) => r.toString())
      .join(`\n`);
    const memberRolesSize = targetMember.roles.cache.filter(
      (r: any) => r.id !== interaction.guild.id
    ).size;

    const embed = new EmbedBuilder()
      .setColor(`Random`)
      .setTitle(`Roles [${memberRolesSize}]`)
      .setDescription(`${memberRoles || "No Roles"}`);

    interaction.reply({ embeds: [embed], flags: "Ephemeral" });
  } else if (customId.startsWith("userinfo:badges")) {
    const userId = customId.split("-")[1];
    const user = await client.users.cache.get(userId);

    let badges = [] as any;

    await Promise.all(
      user.flags.toArray().map(async (badge: any) => {
        if (badge === "PreimumEarlySupporter")
          badges.push(
            "<:earlysupporter:1437459021597642772> - Early Supporter"
          );
        if (badge === "ActiveDeveloper")
          badges.push(
            "<:activedeveloperbadge:1437459376687550517> - Active Developer"
          );
        if (badge === "VerifiedBot")
          badges.push(
            "<:DiscordEarlyBotDeveloper:1437461956247158804> - Verified Bot Developer"
          );
        if (badge === "Partner")
          badges.push("<:Partner:1437463509645529118> - Discord Partner");
        if (badge === "BugHunterLevel1")
          badges.push(
            "<:Square_Bug_Hunter:1437463916182769717> - Discord Bug Hunter (Green)"
          );
        if (badge === "BugHunterLevel2")
          badges.push(
            "<:Square_Bug_Hunter_Gold:1437464025091805356> - Discord Bug Hunter (Yellow)"
          );
        if (badge === "CertifiedModerator")
          badges.push(
            "<:Moderator_Programs_Alumni:1437465597318402048> - Moderator Programs Alumni"
          );
        if (badge === "Hypesquad")
          badges.push(
            "<:HypeSquad_Events:1437466099892359352> - Hypesquad Events"
          );
        if (badge === "HypeSquadOnlineHouse1")
          badges.push(
            "<:Hypesquadbravery:1437466313214791803> - Hypesquad Bravery"
          );
        if (badge === "HypeSquadOnlineHouse2")
          badges.push(
            "<:hypersquad_brilliance:1437466541879988295> - Hypesquad Brilliance"
          );
        if (badge === "HypeSquadOnlineHouse3")
          badges.push(
            "<:Hypesquadbalance:1437466980788469841>  - Hypesquad Balance"
          );
      })
    );

    //For Nitro
    try {
      const userData = await fetch(
        `https://japi.rest/discord/v1/user/${userId}`
      );
      const { data } = (await userData.json()) as JapiDiscordUserResponse;

      if (data.public_flags_array) {
        await Promise.all(
          data.public_flags_array.map(async (badge: any) => {
            if (badge === "NITRO")
              badges.push("<:discordnitro:1234884669401727018> - Nitro");
          })
        );
      }
    } catch (err) {
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(`Random`)
      .setTitle(`Badges [${badges.length}]`)
      .setDescription(`${badges.join("\n") || "No Badges"}`);

    interaction.reply({ embeds: [embed], flags: "Ephemeral" });
  }
});
