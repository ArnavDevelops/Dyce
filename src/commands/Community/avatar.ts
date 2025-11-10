import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ApplicationCommandOptionType,
  InteractionContextType,
} from "discord.js";
import { Command } from "../../structures/Command";
import { JapiDiscordUserResponse } from "../../typings/IJapiRest";

export default new Command({
  name: "avatar",
  description: "Avatar of the user/server",
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "user",
      description: "Check a person's avatar",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "type",
          description: "Choose the type of avatar",
          type: ApplicationCommandOptionType.String,
          choices: [
            { name: "Default Avatar", value: "default" },
            { name: "Server Avatar", value: "server" },
          ],
          required: true,
        },
        {
          name: "user",
          description: "Select a user",
          type: ApplicationCommandOptionType.User,
        },
      ],
    },
    {
      name: "server",
      description: "Look at the server's icon",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;

    if (args.getSubcommand() === "user") {
      const user = args.getUser("user") || interaction.user;
      const type = args.getString("type");

      if (type == "default" || !type) {
        const avatar = user.avatarURL({ size: 4096 });

        const button = new ButtonBuilder()
          .setLabel("Download")
          .setStyle(ButtonStyle.Link)
          .setURL(user.avatarURL({ size: 4096 }));

        const button2 = new ButtonBuilder()
          .setCustomId("tryuserinfo")
          .setLabel("Try /userinfo too!")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true);
        const row = new ActionRowBuilder().addComponents(button, button2);

        //Finally
        const embed = new EmbedBuilder()
          .setTitle(`${user.username}'s Avatar`)
          .setImage(avatar)
          .setColor("Random");
        return await interaction.reply({
          embeds: [embed],
          components: [row.toJSON()],
        });
      } else if (type == "server") {
        let res = await fetch(`https://japi.rest/discord/v1/user/${user}`);
        const { data } = (await res.json()) as JapiDiscordUserResponse;
        if (!data) return;

        //If the user's avatar is not null nor undefined
        if (data.avatar !== undefined && data.avatar !== null) {
          let avatar = `https://japi.rest/discord/v1/user/${user}/avatars/${data.avatar}.webp?size=4096`;

          //Buttons
          const button = new ButtonBuilder()
            .setLabel("Download")
            .setStyle(ButtonStyle.Link)
            .setURL(avatar);

          const button2 = new ButtonBuilder()
            .setCustomId("tryuserinfo")
            .setLabel("Try /userinfo too!")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);
          const row = new ActionRowBuilder().addComponents(button, button2);

          const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(avatar)
            .setColor("Random");
          return await interaction.reply({
            embeds: [embed],
            components: [row.toJSON()],
          });
        } else {
          const avatar = user.avatarURL({ size: 4096 });

          const button = new ButtonBuilder()
            .setLabel("Download")
            .setStyle(ButtonStyle.Link)
            .setURL(user.avatarURL({ size: 4096 }));

          const button2 = new ButtonBuilder()
            .setCustomId("tryuserinfo")
            .setLabel("Try /userinfo too!")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);
          const row = new ActionRowBuilder().addComponents(button, button2);

          const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(avatar)
            .setColor("Random");
          return await interaction.reply({
            embeds: [embed],
            components: [row.toJSON()],
          });
        }
      }
    }

    if (args.getSubcommand() === "server") {
      const avatar = guild.iconURL({ size: 4096 });

      const button = new ButtonBuilder()
        .setLabel("Download")
        .setStyle(ButtonStyle.Link)
        .setURL(guild.iconURL());

      const button2 = new ButtonBuilder()
        .setCustomId("trrguildinfo")
        .setLabel("Try /serverinfo too!")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);
      const row = new ActionRowBuilder().addComponents(button, button2);

      const embed = new EmbedBuilder()
        .setTitle(`${guild.name}'s Avatar`)
        .setImage(avatar)
        .setColor("Random");
      return await interaction.reply({
        embeds: [embed],
        components: [row.toJSON()],
      });
    }
  },
});
