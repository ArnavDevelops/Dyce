import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "invite",
  description: "Invite the bot",
  run: async ({ interaction }) => {
    const button1 = new ButtonBuilder()
      .setLabel("Invite Dyce")
      .setStyle(ButtonStyle.Link)
      .setURL(
        "https://discord.com/oauth2/authorize?client_id=1165391647845142548&permissions=8&scope=applications.commands+bot"
      );
    const button2 = new ButtonBuilder()
      .setLabel("Support Server")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/jU7EKmyUxu");
    const row = new ActionRowBuilder().addComponents(button1, button2);
    const embed = new EmbedBuilder()
      .setColor("White")
      .setAuthor({
        iconURL:
          "https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&",
        name: "Invite Dyce",
      })
      .setDescription(
        "Hey there, I'm dyce the best open-sourced and user-friendly Moderation & Management bot you can find for your server."
      )
      .addFields([
        {
          name: "Why I can't invite dyce to my server?",
          value:
            "Two possible reasons: i) You don't have `Manage Server` permission, | ii) You're not on the correct account",
        },
        {
          name: "What permission(s) does dyce obtain upon joining?",
          value: "Dyce obtains the `Administrator` permission.",
        },
      ])
      .setFooter({
        iconURL:
          "https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&",
        text: 'Thank you for choosing dyce | "For the Users and Servers!"',
      });
    return await interaction.reply({
      embeds: [embed],
      components: [row.toJSON()],
    });
  },
});
