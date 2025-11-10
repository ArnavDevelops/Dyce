import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  InteractionContextType,
  ApplicationCommandOptionType,
  TextChannel,
  NewsChannel,
} from "discord.js";
import reactionRolesSchema from "../../schemas/reactionRolesSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "reactionroles",
  description: "Sends a set of roles for users to choose",
  contexts: [InteractionContextType.Guild],
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: "channel",
      description: "Select the channel",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "role1",
      description: "The first role",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "role2",
      description: "The second role",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "message1",
      description: "The description about the first role",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "message2",
      description: "The description about the second role",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "role3",
      description: "The third role",
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
    {
      name: "message3",
      description: "The description about the third role",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "role4",
      description: "The fourth role",
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
    {
      name: "message4",
      description: "The description about the fourth role",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;

    const role1 = guild.roles.cache.get(args.getRole("role1").id);
    const role2 = guild.roles.cache.get(args.getRole("role2").id);
    const role3 = args.getRole("role3")
      ? guild.roles.cache.get(args.getRole("role3").id)
      : null;
    const role4 = args.getRole("role4")
      ? guild.roles.cache.get(args.getRole("role4").id)
      : null;
    const message1 = args.getString("message1");
    const message2 = args.getString("message2");
    const message3 = args.getString("message3");
    const message4 = args.getString("message4");

    const channel = guild.channels.cache.get(args.getChannel("channel").id);
    if (
      !channel ||
      !(channel instanceof TextChannel || channel instanceof NewsChannel)
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:warning: Please select a valid text channel***");
      return await interaction.reply({
        embeds: [embed],
        flags: "Ephemeral",
      });
    }

    let row = new ActionRowBuilder();

    const embed = new EmbedBuilder()
      .setTitle("Reaction Roles")
      .setDescription(
        "***<:Information:1437468637899395266> Click one or more of the buttons to get the role of your choice!***"
      )
      .addFields({ name: role1.name, value: message1 })
      .addFields({ name: role2.name, value: message2 });

    const role1btn = new ButtonBuilder()
      .setCustomId("reactionrole:role1")
      .setLabel(role1.name)
      .setStyle(ButtonStyle.Primary);
    const role2btn = new ButtonBuilder()
      .setCustomId("reactionrole:role2")
      .setLabel(role2.name)
      .setStyle(ButtonStyle.Primary);
    if (role3) {
      const role3btn = new ButtonBuilder()
        .setCustomId("reactionrole:role3")
        .setLabel(role3.name)
        .setStyle(ButtonStyle.Primary);

      embed.addFields({ name: role3.name, value: message3 });
      row.addComponents(role3btn);

      if (role4) {
        const role4btn = new ButtonBuilder()
          .setCustomId("reactionrole:role4")
          .setLabel(role4.name)
          .setStyle(ButtonStyle.Primary);

        embed.addFields({ name: role4.name, value: message4 });
        row.addComponents(role4btn);
      }
    } else if (role4) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "***:warning: Select role3 first in order to use role4***"
        );
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    }

    const deleteBtn = new ButtonBuilder()
      .setCustomId("reactionrole:delete")
      .setLabel("Delete")
      .setStyle(ButtonStyle.Danger);
    row.addComponents(role1btn, role2btn, deleteBtn);

    const msg = await channel.send({
      embeds: [embed],
      components: [row.toJSON()],
    });
    await interaction.reply({
      content: `Successfully sent the embed to <#${channel.id}>`,
      flags: "Ephemeral",
    });

    try {
      await new reactionRolesSchema({
        guildId: guild.id,
        channelId: channel.id,
        msgId: msg.id,
        role1: role1.id,
        role2: role2.id,
        role3: role3 ? role3.id : "None",
        role4: role4 ? role4.id : "None",
      }).save();
    } catch (err) {
      return;
    }
  },
});
