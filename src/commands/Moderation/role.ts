import {
  EmbedBuilder,
  InteractionContextType,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "role",
  description: "Assign or remove roles to a user or from @everyone",
  defaultMemberPermissions: ["ManageRoles"],
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "all",
      description: "Gives a role to everyone",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: "Select the role.",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
        {
          name: "filter",
          description: "Roles to ignore (Default: Bots)",
          type: ApplicationCommandOptionType.String,
          choices: [
            { name: "Bots", value: "bots" },
            { name: "Humans", value: "humans" },
            { name: "None", value: "none" },
          ],
          required: true,
        },
      ],
    },
    {
      name: "change",
      description: "Change someone's roles",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "Select the User",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "add",
          description: "Select the role to add",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
        {
          name: "remove",
          description: "Select the role to remove",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "give",
      description: "Assign someone a role",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "Select the User",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "role",
          description: "Select the role to add",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove a role from someone",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "Select the User",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "role",
          description: "Select the role to add",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;

    if (args.getSubcommand() === "all") {
      const role = args.getRole("role");
      const filter = args.getString("filter");

      if (filter == "humans") {
        if (role.name === "@everyone") {
          const errorembed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: you cannot give everyone the `@everyone` role.***"
            );
          return await interaction.reply({
            embeds: [errorembed],
            flags: ["Ephemeral"],
          });
        }

        await guild.members.fetch();
        const members = guild.members.cache.filter((m: any) => m.user.bot);
        const totalMembers = guild.members.cache.filter(
          (m: any) => m.user.bot
        ).size;

        const givingEveryoneEmbed = new EmbedBuilder()
          .setColor("Random")
          .setDescription(
            `***<a:blurpleLoad:1274739092835270668> Giving bots the \`${role.name}\` role...this may take some time.***`
          );
        await interaction.reply({ embeds: [givingEveryoneEmbed] });
        let num = 0;
        setTimeout(() => {
          members.forEach(async (m: any) => {
            await m.roles.add(role).catch((err: Error) => {
              return;
            });
            num++;

            const givingEmbed = new EmbedBuilder()
              .setDescription(
                `***<a:burpleLoad:1274739092835270668> ${num} bots have the \`${role.name}\` role now.***`
              )
              .setColor(`Yellow`);
            await interaction.editReply({ content: ``, embeds: [givingEmbed] });

            if (num === totalMembers) {
              const embed = new EmbedBuilder()
                .setDescription(
                  `***:white_check_mark: All the bots have the \`${role.name}\` role now.***`
                )
                .setColor(`Yellow`);
              await interaction.editReply({ content: ``, embeds: [embed] });
            }
          });
        }, 100);
      } else if (filter == "bots") {
        if (role.name === "@everyone") {
          const errorembed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: you cannot give everyone the `@everyone` role.***"
            );
          return await interaction.reply({
            embeds: [errorembed],
            flags: ["Ephemeral"],
          });
        }

        await guild.members.fetch();
        const members = guild.members.cache.filter((m: any) => !m.user.bot);
        const totalMembers = guild.members.cache.filter(
          (m: any) => !m.user.bot
        ).size;

        const givingEveryoneEmbed = new EmbedBuilder()
          .setColor("Random")
          .setDescription(
            `***<a:blurpleLoad:1274739092835270668> Giving everyone the \`${role.name}\` role...this may take some time.***`
          );
        await interaction.reply({ embeds: [givingEveryoneEmbed] });
        let num = 0;
        setTimeout(() => {
          members.forEach(async (m: any) => {
            await m.roles.add(role).catch((err: Error) => {
              return;
            });
            num++;

            const givingEmbed = new EmbedBuilder()
              .setDescription(
                `***<a:burpleLoad:1274739092835270668> ${num} members have the \`${role.name}\` role now.***`
              )
              .setColor(`Yellow`);
            await interaction.editReply({ content: ``, embeds: [givingEmbed] });

            if (num === totalMembers) {
              const embed = new EmbedBuilder()
                .setDescription(
                  `***:white_check_mark: All the members have the \`${role.name}\` role now.***`
                )
                .setColor(`Yellow`);
              await interaction.editReply({ content: ``, embeds: [embed] });
            }
          });
        }, 100);
      } else if (filter == "none") {
        if (role.name === "@everyone") {
          const errorembed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: you cannot give everyone the `@everyone` role.***"
            );
          return await interaction.reply({
            embeds: [errorembed],
            flags: ["Ephemeral"],
          });
        }

        await guild.members.fetch();
        const members = guild.members.cache;
        const totalMembers = guild.members.cache.size;

        const givingEveryoneEmbed = new EmbedBuilder()
          .setColor("Random")
          .setDescription(
            `***<a:blurpleLoad:1274739092835270668> Giving everyone the \`${role.name}\` role...this may take some time.***`
          );
        await interaction.reply({ embeds: [givingEveryoneEmbed] });
        let num = 0;
        setTimeout(() => {
          members.forEach(async (m: any) => {
            await m.roles.add(role).catch((err: Error) => {
              return;
            });
            num++;

            const givingEmbed = new EmbedBuilder()
              .setDescription(
                `***<a:burpleLoad:1274739092835270668> ${num} members & bots have the \`${role.name}\` role now.***`
              )
              .setColor(`Yellow`);
            await interaction.editReply({ content: ``, embeds: [givingEmbed] });

            if (num === totalMembers) {
              const embed = new EmbedBuilder()
                .setDescription(
                  `***:white_check_mark: All the members & bots have the \`${role.name}\` role now.***`
                )
                .setColor(`Yellow`);
              await interaction.editReply({ content: ``, embeds: [embed] });
            }
          });
        }, 100);
      }
      if (role.name === "@everyone") {
        const errorembed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: you cannot give everyone the `@everyone` role.***"
          );
        return await interaction.reply({
          embeds: [errorembed],
          flags: ["Ephemeral"],
        });
      }

      await guild.members.fetch();
      const members = guild.members.cache.filter((m: any) => !m.user.bot);
      const totalMembers = guild.members.cache.filter(
        (m: any) => !m.user.bot
      ).size;

      const givingEveryoneEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(
          `***<a:blurpleLoad:1274739092835270668> Giving everyone the \`${role.name}\` role...this may take some time.***`
        );
      await interaction.reply({ embeds: [givingEveryoneEmbed] });
      let num = 0;
      setTimeout(() => {
        members.forEach(async (m: any) => {
          await m.roles.add(role).catch((err: Error) => {
            return;
          });
          num++;

          const givingEmbed = new EmbedBuilder()
            .setDescription(
              `***<a:burpleLoad:1274739092835270668> ${num} members have the \`${role.name}\` role now.***`
            )
            .setColor(`Yellow`);
          await interaction.editReply({ content: ``, embeds: [givingEmbed] });

          if (num === totalMembers) {
            const embed = new EmbedBuilder()
              .setDescription(
                `***:white_check_mark: All the members have the \`${role.name}\` role now.***`
              )
              .setColor(`Yellow`);
            await interaction.editReply({ content: ``, embeds: [embed] });
          }
        });
      }, 100);
    } else if (args.getSubcommand() === "change") {
      const user = args.getUser("user");
      const person = await guild.members
        .fetch(user)
        .catch(async (err: Error) => {
          const failEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
            );
          await interaction.reply({ embeds: [failEmbed], flags: ["Ephemeral"] });
          return null;
        });
      if (!person) return;
      const addRole = args.getRole("add");
      const removeRole = args.getRole("remove");

      if (addRole.name === "@everyone" && removeRole.name === "@everyone") {
        const errorembed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: you cannot give or remove the role `@everyone`.***"
          );
        return await interaction.reply({
          embeds: [errorembed],
          flags: ["Ephemeral"],
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
        interaction.reply({ embeds: [addEmbed], flags: ["Ephemeral"] });
      } catch (error) {
        return;
      }
    } else if (args.getSubcommand() === "give") {
      console.log("this")
      const role = args.getRole("role");

      if (role.name === "@everyone") {
        const errorembed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: you cannot give the role `@everyone`.***"
          );
        return await interaction.reply({
          embeds: [errorembed],
          flags: ["Ephemeral"],
        });
      }

      const user = args.getUser(`user`);
      const targetMember = await guild.members
        .fetch(user)
        .catch(async (err: Error) => {
          const failEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
            );
          await interaction.reply({ embeds: [failEmbed], flags: ["Ephemeral"] });
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
    } else if (args.getSubcommand() === "remove") {
      const role = args.getRole("role");

      if (role.name === "@everyone") {
        const errorembed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: you cannot give the role `@everyone`.***"
          );
        return await interaction.reply({
          embeds: [errorembed],
          flags: ["Ephemeral"],
        });
      }

      const user = args.getUser("user");
      const targetMember = await guild.members
        .fetch(user)
        .catch(async (err: Error) => {
          const failEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: There was an error searching for the user, make sure that the user is in the server.***"
            );
          await interaction.reply({ embeds: [failEmbed], flags: ["Ephemeral"] });
          return null;
        });
      if (!targetMember) return;

      if (!targetMember.roles.cache.has(role.id)) {
        const embed1 = new EmbedBuilder()
          .setDescription(
            "***:x: Make sure that the user has the role you've mentioned.***"
          )
          .setColor(`Red`);
        return await interaction.reply({ embeds: [embed1], flags: ["Ephemeral"] });
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
});
