import {
  EmbedBuilder,
  PermissionsBitField,
  InteractionContextType,
  ApplicationCommandOptionType,
  GuildMember,
} from "discord.js";
import modNotesSchema from "../../schemas/modNotesSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "ban",
  description: "Bans a user",
  defaultMemberPermissions: ["BanMembers"],
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "user",
      description: "Select the user or input a userID",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "The reason",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "delete_messages",
      description: "Should the messages be deleted?",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
    {
      name: "note",
      description: "Anything to note about this particular action?",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;

    const user = args.getUser("user");
    const member = (await guild.members.fetch(user.id).catch((err: Error) => {
      return;
    })) as GuildMember;
    const reason = args.getString("reason");
    const deletemsgs = args.getBoolean("delete_messages") || false;
    const note = args.getString("note");

    if (user.id == interaction.user.id) {
      const cannotbanyourself = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You can't ban yourself.***");
      return await interaction.reply({
        embeds: [cannotbanyourself],
        flags: ["Ephemeral"],
      });
    }

    if (user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: You cannot ban bots.***");
      return await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
    }

    if (member) {
      if (member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        const cannotbanMods = new EmbedBuilder()
          .setColor("Red")
          .setDescription("***:x: I can't ban Moderators and Above.***");
        return await interaction.reply({
          embeds: [cannotbanMods],
          flags: ["Ephemeral"],
        });
      }
    }

    try {
      if (deletemsgs == false) {
        const dmEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `🚫 You have been banned from ***${guild.name}*** by ${interaction.user.username}`
          )
          .addFields({
            name: "Reason",
            value: `${reason}`,
          });
        await user.send({ embeds: [dmEmbed] }).catch((err: Error) => {
          return;
        });

        const embed2 = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `:white_check_mark: Successfully Banned ***${user.username}***`
          )
          .addFields({
            name: "Reason",
            value: `${reason}`,
          });
        await interaction.reply({ embeds: [embed2] });
        return await guild.bans
          .create(user.id, { reason: reason })
          .catch((err: Error) => {
            return;
          });
      } else if (deletemsgs == true) {
        await guild.bans
          .create(user.id, { reason: reason, deleteMessageDays: 7 })
          .catch((err: Error) => {
            return;
          });

        const messages = await interaction.channel.messages.fetch({
          limit: 100,
          before: interaction.id,
        });

        const userMessages = messages.filter(
          (m: any) => m.author.id === user.id
        );

        return await interaction.channel.bulkDelete(userMessages, true);
      } else if (note) {
        await new modNotesSchema({
          guildId: guild.id,
          moderatorId: interaction.user.id,
          command: "/ban",
          date: Date.now(),
          note: `Moderated: ${member.user.username} | **${note}**`,
        }).save();
      }
    } catch (err) {
      return;
    }
  },
});
