const { EmbedBuilder } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  name: "roleCreate",
  async execute(role) {
    try {
      const logData = await logSchema.findOne({ Guild: role.guild.id });
      if (!logData) return;

      const logChannel = role.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle(`Role created`)
        .setDescription(
          `**Role Name:**\n ${role.name}\n
        **ID:**\n ${role.id}\n
        **Mentionable**\n${role.mentionable}\n
        **Display Separately**\n ${role.hoist}`
        )
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
