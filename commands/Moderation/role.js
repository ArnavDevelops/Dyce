const {
  SlashCommandBuilder,
  PermissionsBitField,
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
    ),
  async execute(interaction, client) {
    const { options, guild, member } = interaction;

    //All
    if (options.getSubcommand() === "all") {
      const permission = member.permissions.has(
        PermissionsBitField.Flags.Administrator
      );

      const permissionEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "***:warning: You don't have the permission `Administrator` to use this Command.***"
        );
      if (!permission)
        return interaction.reply({
          embeds: [permissionEmbed],
          ephemeral: true,
        });

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
      const hasPermissionToUseThisCmd = member.permissions.has(
        PermissionsBitField.Flags.Administrator
      );

      if (hasPermissionToUseThisCmd) {
        const givingEveryoneEmbed = new EmbedBuilder()
          .setColor("Random")
          .setDescription(
            `***<a:Prints_dark:1112909035948212327> Giving everyone the \`${role.name}\` role...this may take some time.***`
          );
        await interaction.reply({ embeds: [givingEveryoneEmbed] });
        let num = 0;
        setTimeout(() => {
          members.forEach(async (m) => {
            m.roles.add(role).catch((err) => {
              return console.log(err);
            });
            num++;

            const givingEmbed = new EmbedBuilder()
              .setDescription(
                `***:white_check_mark: ${num} members have the \`${role.name}\` role now.***`
              )
              .setColor(`Yellow`);
            await interaction.editReply({ embeds: ``, embeds: [givingEmbed] });
          });
        }, 100);
      }
    }

    //Change
    else if (options.getSubcommand() === "change") {
      const permission = member.permissions.has(
        PermissionsBitField.Flags.ManageRoles
      );

      const permissionEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "***:warning: You don't have the permission `Manage Roles` to use this Command.***"
        );
      if (!permission)
        return interaction.reply({
          embeds: [permissionEmbed],
          ephemeral: true,
        });

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
        person.roles.add(addRole);
        person.roles.remove(removeRole);

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

    //Give
    else if (options.getSubcommand() === "give") {
      const permission = member.permissions.has(
        PermissionsBitField.Flags.ManageRoles
      );

      const permissionEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "***:warning: You don't have the permission `Manage Roles` to use this Command.***"
        );
      if (!permission)
        return interaction.reply({
          embeds: [permissionEmbed],
          ephemeral: true,
        });

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
        targetMember.roles.add(role);
        const embed = new EmbedBuilder()
          .setDescription(
            `***:white_check_mark: Successfully added role ${role} to ${targetMember.toString()}.***`
          )
          .setColor(`Green`);
        interaction.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    //Remove
    else if (options.getSubcommand() === "remove") {
      const permission = member.permissions.has(
        PermissionsBitField.Flags.ManageRoles
      );

      const permissionEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "***:warning: You don't have the permission `Manage Roles` to use this Command.***"
        );
      if (!permission)
        return interaction.reply({
          embeds: [permissionEmbed],
          ephemeral: true,
        });

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
            "***:x: Make the user has the role you've mentioned.***"
          )
          .setColor(`Red`);
        return await interaction.reply({ embeds: [embed1], ephemeral: true });
      }
      try {
        targetMember.roles.remove(role);
        const embed = new EmbedBuilder()
          .setDescription(
            `***:white_check_mark: Successfully removed role ${role} from ${targetMember.toString()}.***`
          )
          .setColor("Green");
        interaction.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }
  },
};
