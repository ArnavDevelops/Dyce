const { EmbedBuilder } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");
const {
  getChangedProperties,
} = require(`../../helpers/getChangedProperties.js`);

module.exports = {
  name: "guildUpdate",
  async execute(oldGuild, newGuild) {
    try {
      const logData = await logSchema.findOne({ Guild: newGuild.id });
      if (!logData) return;

      const logChannel = newGuild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      const changedProperties = await getChangedProperties(oldGuild, newGuild);

      if (changedProperties.length === 0) return;

      const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Guild Updated")
        .setDescription(
          changedProperties
            .map(
              (prop) =>
                `**${prop.name}:**\n ${prop.oldValue} ⮕ ${prop.newValue}\n`
            )
            .join("\n")
        )
        .setThumbnail(newGuild.iconURL())
        .setFooter({
          text: "Dyce#3312",
          iconURL: "https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&",
        })
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (err) {
      return;
    }
  },
};
