import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  TextChannel,
  GuildMember,
} from "discord.js";
import eventsSchema from "../../schemas/eventsSchema";
import eventsRoleSchema from "../../schemas/eventsRoleSchema";
import { Event } from "../../structures/Event";

export default new Event("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  if (!interaction.inCachedGuild()) return;

  const { guild, customId, message } = interaction;
  const textChannel = interaction.channel as TextChannel;
  const member = interaction.member as GuildMember;

  if (!member || !("roles" in member)) return;
  if (!message) return;
  if (!guild) return;

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

  try {
    const data = await eventsSchema.findOne({
      guildId: guild.id,
      msgId: message.id,
    });
    if (!data) return;
    const msg = await textChannel.messages.fetch(data.msgId);
    const thread = await textChannel.threads.cache.find(
      (x: any) => x.name === data.threadId
    );
    const joiningList = data.joiningList as any;
    const notJoiningList = data.notJoiningList as any;
    const neutralList = data.neutralList as any;

    const usernames = interaction.user.username;
    const maxLength = 11;
    let displayName = `> ${usernames.replace(/\s/g, "\u00A0")}`;
    if (displayName.length > maxLength) {
      displayName = `${displayName.substring(0, maxLength - 3)}...`;
    }

    if (customId == "join") {
      await interaction.deferReply({ ephemeral: true });

      if (!joiningList.includes(displayName)) {
        if (notJoiningList.includes(displayName)) {
          notJoiningList.pull(displayName);
        }
        if (neutralList.includes(displayName)) {
          neutralList.pull(displayName);
        }

        const joinedEmbed = new EmbedBuilder()
          .setColor("DarkGreen")
          .setDescription("***Successfully stated that you're joining.***");
        await interaction.followUp({
          embeds: [joinedEmbed],
          ephemeral: true,
        });

        joiningList.push(displayName);
        data.save();
      } else {
        const alreadyJoinedEmbed = new EmbedBuilder()
          .setColor("DarkGreen")
          .setDescription(
            "***:warning: You have already indicated that you're joining.***"
          );
        await interaction.followUp({
          embeds: [alreadyJoinedEmbed],
          ephemeral: true,
        });
      }
    } else if (customId == "not_joining") {
      await interaction.deferReply({ ephemeral: true });

      if (!notJoiningList.includes(displayName)) {
        if (joiningList.includes(displayName)) {
          joiningList.pull(displayName);
        }
        if (neutralList.includes(displayName)) {
          neutralList.pull(displayName);
        }

        const notJoinedEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(`***Successfully stated that you're not joining.***`);
        await interaction.followUp({
          embeds: [notJoinedEmbed],
          ephemeral: true,
        });

        notJoiningList.push(displayName);
        data.save();
      } else {
        const alreadyNotJoinedEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: You have already indicated that you're not joining.***"
          );
        await interaction.followUp({
          embeds: [alreadyNotJoinedEmbed],
          ephemeral: true,
        });
      }
    } else if (customId == "neutral") {
      await interaction.deferReply({ ephemeral: true });

      if (!neutralList.includes(displayName)) {
        if (joiningList.includes(displayName)) {
          joiningList.pull(displayName);
        }
        if (notJoiningList.includes(displayName)) {
          notJoiningList.pull(displayName);
        }

        const tentativeEmbed = new EmbedBuilder()
          .setColor("White")
          .setDescription(
            "***Successfully stated that you're tentative or neutral.***"
          );
        await interaction.followUp({
          embeds: [tentativeEmbed],
          ephemeral: true,
        });

        neutralList.push(displayName);
        data.save();
      } else {
        const tentativeEmbed = new EmbedBuilder()
          .setColor("White")
          .setDescription(
            "***:warning: You have already indicated that you're Tentative or Neutral***"
          );
        await interaction.followUp({
          embeds: [tentativeEmbed],
          ephemeral: true,
        });
      }
    } else if (customId == "cancel") {
      const eventsRoleData = await eventsRoleSchema.findOne({
        guildId: guild.id,
      });
      if (!eventsRoleData) {
        const joinedEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: Having issues finding this Event's data. Make sure there is a host role for this server.***"
          );
        await interaction.reply({
          embeds: [joinedEmbed],
          ephemeral: true,
        });
      }
      if (eventsRoleData == null) return;
      const role = guild.roles.cache.get(eventsRoleData.roleId);

      if (!interaction.member.roles.cache.has(role.id)) {
        const errorEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:x: You don't have permission to use this button.***"
          );
        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
      } else {
        buttonRow.components.forEach((c: any) => c.setDisabled(true));
        await interaction.update({ components: [buttonRow.toJSON()] });
        await thread.delete();
        await eventsSchema.findOneAndDelete({ msgId: message.id });
        const endembed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `***:warning: Event "${data.title}" has been cancelled by ${member.displayName}***`
          )
          .setTimestamp();
        return await textChannel.send({ embeds: [endembed] });
      }
    }

    const trainingEmbed = EmbedBuilder.from(msg.embeds[0]).setFields([
      {
        name: "Time:",
        value: `<t:${Math.floor(
          (data.startTime as any) / 1000
        )}:F> - <t:${Math.floor(
          (data.endTime as any) / 1000
        )}:t>\n ⏳ <t:${Math.floor((data.startTime as any) / 1000)}:R>`,
        inline: false,
      },
      {
        name: "Joined",
        value: joiningList.length > 0 ? joiningList.join("\n") : "> -",
        inline: true,
      },
      {
        name: "Abstained",
        value: notJoiningList.length > 0 ? notJoiningList.join("\n") : "> -",
        inline: true,
      },
      {
        name: "Tentative",
        value: neutralList.length > 0 ? neutralList.join("\n") : "> -",
        inline: true,
      },
    ]);

    msg.edit({ embeds: [trainingEmbed], components: [buttonRow.toJSON()] });

    setTimeout(async () => {
      buttonRow.components.forEach((c: any) => c.setDisabled(true));
      await msg.edit({ components: [buttonRow.toJSON()] });
      return await eventsSchema.findOneAndDelete({ msgId: message.id });
    }, data.timeItStarts as any);
  } catch (err) {
    return;
  }
});
