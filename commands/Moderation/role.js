//Imports
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription(
      "Role everyone, change someone's roles, or add or remove someone's roles."
    )
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("all")
        .setDescription("Role everyone in the server.")
        .addRoleOption((role) =>
          role
            .setName("role")
            .setDescription(
              "Which role you wanna give to everyone in the server."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("change")
        .setDescription(`Change somebody's role.`)
        .addUserOption((user) =>
          user
            .setName("user")
            .setDescription("Select the user.")
            .setRequired(true)
        )
        .addRoleOption((role) =>
          role
            .setName("add")
            .setDescription("Which role you wanna give to a specific person.")
            .setRequired(true)
        )
        .addRoleOption((role) =>
          role
            .setName("remove")
            .setDescription(
              "Which role you wanna remove from a specific person."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("give")
        .setDescription(`Give someone a role.`)
        .addUserOption((user) =>
          user
            .setName("user")
            .setDescription("Select the user.")
            .setRequired(true)
        )
        .addRoleOption((role) =>
          role
            .setName("add")
            .setDescription("Which role you wanna add to the user.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription(`Remove someone's role.`)
        .addUserOption((user) =>
          user
            .setName("user")
            .setDescription("Select the user.")
            .setRequired(true)
        )
        .addRoleOption((role) =>
          role
            .setName("remove")
            .setDescription("Which role you wanna remove from the user.")
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction, client) {
    const { options, guild } = interaction;



    //All
    if (options.getSubcommand() === "all") {
      const role = options.getRole("role");

      if (role.name === "@everyone") {
        const errorembed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: you cannot give everyone the `@everyone` role.***"
          );
        return await interaction.reply({
          embeds: [errorembed],
          ephemeral: true,
        });
      }

      await guild.members.fetch();
      const members = guild.members.cache.filter((m) => !m.user.bot);

      const givingEveryoneEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(
          `***<a:Loading:1245327249029333002> Giving everyone the \`${role.name}\` role...this may take some time.***`
        );
      await interaction.reply({ embeds: [givingEveryoneEmbed] });
      let num = 0;
      setTimeout(() => {
        members.forEach(async (m) => {
          await m.roles.add(role).catch((err) => {
            return;
          });
          num++;

          const givingEmbed = new EmbedBuilder()
            .setDescription(
              `***<a:Loading:1245327249029333002> ${num} members have the \`${role.name}\` role now.***`
            )
            .setColor(`Yellow`);
          await interaction.editReply({ embeds: ``, embeds: [givingEmbed] });
        });
      }, 100);
    }



    //Change
    else if (options.getSubcommand() === "change") {
      const user = options.getUser("user");
      const person = await guild.members.fetch(user).catch(async (err) => {
        const failEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
          );
        await interaction.reply({ embeds: [failEmbed], ephemeral: true });
        return null;
      });
      if (!person) return;
      const addRole = options.getRole("add");
      const removeRole = options.getRole("remove");

      if (addRole.name === "@everyone" && removeRole.name === "@everyone") {
        const errorembed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: you cannot give or remove the role `@everyone`.***"
          );
        return await interaction.reply({
          embeds: [errorembed],
          ephemeral: true,
        });
      }

      try {
        //Role Change
        await person.roles.add(addRole);
        await person.roles.remove(removeRole);

        const addEmbed = new EmbedBuilder()
          .setDescription(
            `***:white_check_mark: Successfully added ${addRole} and removed ${removeRole} from ${user.toString()}.***`
          )
          .setColor("Green");
        interaction.reply({ embeds: [addEmbed], ephemeral: true });
      } catch (error) {
        return;
      }
    }



    //Give Subcommand
    else if (options.getSubcommand() === "give") {
      const role = options.getRole("add");

      if (role.name === "@everyone") {
        const errorembed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: you cannot give the role `@everyone`.***"
          );
        return await interaction.reply({
          embeds: [errorembed],
          ephemeral: true,
        });
      }

      const user = options.getUser(`user`);
      const targetMember = await guild.members
        .fetch(user)
        .catch(async (err) => {
          const failEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
            );
          await interaction.reply({ embeds: [failEmbed], ephemeral: true });
          return null;
        });
      if (!targetMember) return;

      try {
        //Adds role
        await targetMember.roles.add(role);
        const embed = new EmbedBuilder()
          .setDescription(
            `***:white_check_mark: Successfully added role ${role} to ${targetMember.toString()}.***`
          )
          .setColor(`Green`);
        return await interaction.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }



    //Remove Subcommand
    else if (options.getSubcommand() === "remove") {
      const role = options.getRole("remove");

      if (role.name === "@everyone") {
        const errorembed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: you cannot give the role \`@everyone\`.***"
          );
        return await interaction.reply({
          embeds: [errorembed],
          ephemeral: true,
        });
      }

      const user = options.getUser("user");
      const targetMember = await guild.members
        .fetch(user)
        .catch(async (err) => {
          const failEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: There was an error searching for the user, make sure that the user is in the server.***"
            );
          await interaction.reply({ embeds: [failEmbed], ephemeral: true });
          return null;
        });
      if (!targetMember) return;

      if (!targetMember.roles.cache.has(role.id)) {
        const embed1 = new EmbedBuilder()
          .setDescription(
            "***:x: Make sure that the user has the role you've mentioned.***"
          )
          .setColor(`Red`);
        return await interaction.reply({ embeds: [embed1], ephemeral: true });
      }
      try {
        //Removes Role
        await targetMember.roles.remove(role);
        const embed = new EmbedBuilder()
          .setDescription(
            `***:white_check_mark: Successfully removed role ${role} from ${targetMember.toString()}.***`
          )
          .setColor("Green");
        return await interaction.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }
  },
};
