import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  InteractionContextType,
  ApplicationCommandOptionType,
} from "discord.js";
import { toMs } from "ms-typescript";
import eventSchema from "../../schemas/eventsSchema";
import eventsRoleSchema from "../../schemas/eventsRoleSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "event",
  description: "host an event",
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "title",
      description: "the title of the event",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "description",
      description: "the descripton of the event",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "role",
      description: "the role to ping for the event",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "start_time",
      description: "the time for the event to begin",
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "5 minutes", value: "5m" },
        { name: "10 minutes", value: "10m" },
        { name: "20 minutes", value: "20m" },
        { name: "30 minutes", value: "30m" },
        { name: "40 minutes", value: "40m" },
        { name: "1 hour", value: "1h" },
        { name: "2 hours", value: "2h" },
        { name: "3 hours", value: "3h" },
        { name: "4 hours", value: "4h" },
        { name: "5 hours", value: "5h" },
        { name: "6 hours", value: "6h" },
        { name: "7 hours", value: "7h" },
        { name: "8 hours", value: "8h" },
        { name: "12 hours", value: "12h" },
        { name: "24 hours", value: "1d" },
      ],
      required: true,
    },
    {
      name: "end_time",
      description: "the time for the event to end",
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "5 minutes", value: "5m" },
        { name: "10 minutes", value: "10m" },
        { name: "20 minutes", value: "20m" },
        { name: "30 minutes", value: "30m" },
        { name: "40 minutes", value: "40m" },
        { name: "1 hour", value: "1h" },
        { name: "2 hours", value: "2h" },
        { name: "3 hours", value: "3h" },
        { name: "4 hours", value: "4h" },
        { name: "5 hours", value: "5h" },
        { name: "6 hours", value: "6h" },
        { name: "7 hours", value: "7h" },
        { name: "8 hours", value: "8h" },
        { name: "12 hours", value: "12h" },
        { name: "24 hours", value: "1d" },
      ],
      required: true,
    },
  ],
  run: async ({ interaction, args }) => {
    const { member, user, channel, guild } = interaction;

    const data = await eventsRoleSchema.findOne({ guildId: guild.id });
    if (!data || !data.roleId) {
      const embed = new EmbedBuilder()
        .setDescription(
          "***:warning: There's no host role set. Please run /host-role***"
        )
        .setColor("Red");
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    }

    const name = args.getString("title");
    const startTime = toMs(args.getString("start_time") || "");
    const endTime = toMs(args.getString("end_time") || "");
    const role = guild.roles.cache.get(data.roleId);
    const description = args.getString("description");
    let roleToPing = ``;
    if (args.getRole("role").id == guild.id) {
      roleToPing = "@everyone";
    } else {
      roleToPing = `<@&${guild.roles.cache.get(args.getRole("role").id).id}>`;
    }

    if (!member.roles.cache.has(role.id)) {
      const permissionEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `***:warning: You don't have the required role to use this command.***`
        )
        .setFooter({
          iconURL:
            "https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&",
          text: "If you think this server doesn't have that role then run /host-role",
        });
      return interaction.reply({
        embeds: [permissionEmbed],
        flags: "Ephemeral",
      });
    }

    const joinButton = new ButtonBuilder()
      .setCustomId("join")
      .setStyle(ButtonStyle.Primary)
      .setLabel("Join")
      .setDisabled(false);
    const notJoiningButton = new ButtonBuilder()
      .setCustomId("not_joining")
      .setStyle(ButtonStyle.Primary)
      .setLabel("Abstain")
      .setDisabled(false);
    const neutralButton = new ButtonBuilder()
      .setCustomId("neutral")
      .setStyle(ButtonStyle.Primary)
      .setLabel("Tentative")
      .setDisabled(false);
    const endButton = new ButtonBuilder()
      .setCustomId("cancel")
      .setStyle(ButtonStyle.Danger)
      .setLabel("Cancel")
      .setDisabled(false);

    const buttonRow = new ActionRowBuilder().addComponents(
      joinButton,
      notJoiningButton,
      neutralButton,
      endButton
    );
    const timestamp = Date.now() + startTime;
    const endTimestamp = timestamp + endTime;

    const trainingEmbed = new EmbedBuilder()
      .setTitle(`${name}`)
      .setDescription(`${description}`)
      .setColor("Random")
      .addFields([
        {
          name: "Time:",
          value: `<t:${Math.floor(timestamp / 1000)}:F> - <t:${Math.floor(
            endTimestamp / 1000
          )}:t>\n ⏳ <t:${Math.floor(timestamp / 1000)}:R>`,
          inline: false,
        },
        {
          name: `Joined`,
          value: "> -",
          inline: true,
        },
        {
          name: "Abstained",
          value: "> -",
          inline: true,
        },
        {
          name: "Tentative",
          value: "> -",
          inline: true,
        },
      ])
      .setFooter({ text: `Host: ${user.username}`, iconURL: user.avatarURL() })
      .setTimestamp();

    const SHEembed = new EmbedBuilder()
      .setTitle("***Successfully hosted an Event!***")
      .setColor("Green");
    await interaction.reply({ embeds: [SHEembed], flags: "Ephemeral" });

    const message = await channel.send({
      content: roleToPing,
      embeds: [trainingEmbed],
      components: [buttonRow.toJSON()],
    });

    const thread = await message.startThread({
      name: `${name}`,
      reason: "Discuss about the event",
    });
    await thread.members.add(interaction.user);

    message.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });

    try {
      await new eventSchema({
        guildId: guild.id,
        msgId: message.id,
        threadId: thread.name,
        title: name,
        description: description,
        joiningList: [],
        notJoiningList: [],
        neutralList: [],
        startTime: timestamp,
        endTime: endTimestamp,
        timeItStarts: startTime,
      }).save();
    } catch (err) {
      return;
    }
  },
});
