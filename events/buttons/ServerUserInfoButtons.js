const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId } = interaction;

    if (interaction.isButton()) {
      //Server info's button
      if (customId === "roles") {
        const guildRoles = interaction.guild.roles.cache
          .filter((r) => r.id !== interaction.guild.id)
          .sort((a, b) => b.position - a.position)
          .map((r) => r.toString())
          .join(`\n`);
        const guildrolesSize = interaction.guild.roles.cache.size;

        const embed = new EmbedBuilder()
          .setColor(`Yellow`)
          .setTitle(`Roles [${guildrolesSize}]`)
          .setDescription(`${guildRoles}`);

        interaction.reply({ embeds: [embed], ephemeral: true });
      }

      //User info's button
      else if (customId.startsWith("member_roles")) {
        const userId = customId.split("-")[1];
        const targetMember = await interaction.guild.members.fetch(userId);
        const memberRoles = targetMember.roles.cache
          .filter((r) => r.id !== interaction.guild.id)
          .sort((a, b) => b.position - a.position)
          .map((r) => r.toString())
          .join(`\n`);
        const memberRolesSize = targetMember.roles.cache.filter((r) => r.id !== interaction.guild.id).size

        const embed = new EmbedBuilder()
          .setColor(`Random`)
          .setTitle(`Roles [${memberRolesSize}]`)
          .setDescription(`${memberRoles || "No Roles"}`);

        interaction.reply({ embeds: [embed], ephemeral: true });
      }

      else if (customId.startsWith("badges")) {
        const userId = customId.split("-")[1];
        const user = await client.users.cache.get(userId);

        let badges = [];

        await Promise.all(user.flags.toArray().map(async badge => {
          if (badge === "PreimumEarlySupporter") badges.push("<:Badge_EarlySupporter:1235182582933749861> - Early Supporter")
          if (badge === "ActiveDeveloper") badges.push("<:ActiveDeveloper:1234889530700464138> - Active Developer")
          if (badge === "VerifiedBot") badges.push("<:Badge_Developer:1234906223942434868> - Verified Bot Developer")
          if (badge === "Partner") badges.push("<:Partner_Badge:1234906677522989076> - Discord Partner")
          if (badge === "BugHunterLevel1") badges.push("<:Badge_BugHunter:1234907620192682056> - Discord Bug Hunter (Green)")
          if (badge === "BugHunterLevel2") badges.push("<:BugHunterLvl2:1234907727046905899> - Discord Bug Hunter (Yellow)")
          if (badge === "CertifiedModerator") badges.push("<:Moderator_Programs_Alumni:1234908255554375691> - Moderator Programs Alumni")
          if (badge === "Hypesquad") badges.push("<:HypeSquad_Events:1234908937212661801> - Hypesquad Events")
          if (badge === "HypeSquadOnlineHouse1") badges.push("<:Hypesquad_Bravery:1235181178974109747> - Hypesquad Bravery")
          if (badge === "HypeSquadOnlineHouse2") badges.push("<:Hypesquad_Brilliance:1235180639532224532> - Hypesquad Brilliance")
          if (badge === "HypeSquadOnlineHouse3") badges.push("<:Hypesquad_Balance:1235180566715039755> - Hypesquad Balance")
        }))

        //For Nitro
        try {
          const userData = await fetch(`https://japi.rest/discord/v1/user/${userId}`);
          const { data } = await userData.json();
          2
          if (data.public_flags_array) {

            await Promise.all(data.public_flags_array.map(badge => {
              if (badge === "NITRO") badges.push("<:discordnitro:1234884669401727018> - Nitro")
            }));
          }
        } catch (err) {
          return;
        }

        const embed = new EmbedBuilder()
          .setColor(`Random`)
          .setTitle(`Badges [${badges.length}]`)
          .setDescription(`${badges.join("\n") || "No Badges"}`);

        interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }
  },
};
