const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const eventsSchema = require("../../schemas/eventsSchema.js");
const { logMessage } = require("../../helpers/logging.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { member, customId, guild, channel, message } = interaction;

    if (!message) return;
    if (!guild) return;
    if (!interaction.isButton()) return;

    const officerrole = "1188623538173792286";

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
      const msg = await channel.messages.fetch(data.msgId);
      const thread = await channel.threads.cache.find(
        (x) => x.name === data.threadId
      );
      const joiningList = data.joiningList;
      const notJoiningList = data.notJoiningList;
      const neutralList = data.neutralList;

      const userNicknames = interaction.member.displayName;
      const maxLength = 20;
      let displayName = `> ${userNicknames.replace(/\s/g, "\u00A0")}`;
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
          await interaction.editReply({
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
          await interaction.editReply({
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
            .setDescription(
              `***Successfully stated that you're not joining.***`
            );
          await interaction.editReply({
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
          await interaction.editReply({
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
          await interaction.editReply({
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
          await interaction.editReply({
            embeds: [tentativeEmbed],
            ephemeral: true,
          });
        }
      } else if (customId == "cancel") {
        if (
          !interaction.member._roles.some((role) =>
            officerrole.includes(role)
          )
        ) {
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
          buttonRow.components.forEach((c) => c.setDisabled(true));
          await interaction.update({ components: [buttonRow] });
          await thread.delete();
          await eventsSchema.findOneAndDelete({ msgId: message.id });
          const endembed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `***:warning: Event "${data.title}" has been cancelled by ${member.displayName}***`
            )
            .setTimestamp();
          return await channel.send({ embeds: [endembed] });
        }
      }

      const trainingEmbed = EmbedBuilder.from(msg.embeds[0]).setFields([
        {
          name: "Time:",
          value: `<t:${Math.floor(data.startTime / 1000)}:F> - <t:${Math.floor(
            data.endTime / 1000
          )}:t>\n ⏳ <t:${Math.floor(data.startTime / 1000)}:R>`,
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

      msg.edit({ embeds: [trainingEmbed], components: [buttonRow] });

      setTimeout(async () => {
        buttonRow.components.forEach((c) => c.setDisabled(true));
        await msg.edit({ components: [buttonRow] });
        return await eventsSchema.findOneAndDelete({ msgId: message.id });
      }, data.timeItStarts);
    } catch (err) {
      logMessage(err.stack, "ERROR");
    }
  },
};
