import {
  EmbedBuilder,
  InteractionContextType,
  ColorResolvable,
  TextChannel,
  NewsChannel,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "embed",
  description: "Automatically gives a role to users",
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
      name: "title",
      description: "The title",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "description",
      description: "The description",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "image",
      description: "Select the image",
      type: ApplicationCommandOptionType.Attachment,
      required: false,
    },
    {
      name: "icon",
      description: "Select the icon",
      type: ApplicationCommandOptionType.Attachment,
      required: false,
    },
    {
      name: "colour",
      description: "The colour",
      choices: [
        { name: "Red", value: "Red" },
        { name: "Blue", value: "Blue" },
        { name: "Pink", value: "Pink" },
        { name: "Green", value: "Green" },
        { name: "Yellow", value: "Yellow" },
        { name: "Purple", value: "Purple" },
        { name: "Orange", value: "Orange" },
        { name: "Black (Default)", value: "Black" },
        { name: "Aqua", value: "Aqua" },
        { name: "Random", value: "Random" },
        { name: "Navy", value: "Navy" },
        { name: "Grey", value: "Grey" },
        { name: "Dark Blue", value: "DarkBlue" },
      ],
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async ({ interaction, args }) => {
    const { guild } = interaction;

    const title = args.getString("title");
    const description = args.getString("description");
    const colour = args.getString("colour") as ColorResolvable;
    const image = args.getAttachment("image");
    const thumbnail = args.getAttachment("icon");
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

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description);

    if (colour) {
      embed.setColor(colour);
    }

    if (thumbnail) {
      embed.setThumbnail(thumbnail.url);
    }

    if (image) {
      embed.setImage(image.url);
    }

    const reply = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `:white_check_mark: **Successfully sent the embed to ${channel}**`
      );

    await channel.send({ embeds: [embed] });
    return await interaction.reply({ embeds: [reply], flags: "Ephemeral" });
  },
});
