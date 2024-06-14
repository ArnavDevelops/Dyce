import { EmbedBuilder } from "discord.js";
import logSchema from "../../schemas/logSchema"

module.exports = {
  name: "roleUpdate",
  async execute(oldRole: any, newRole: any) {
    try {
      const logData = await logSchema.findOne({ Guild: newRole.guild.id });
      if (!logData) return;

      const logChannel = newRole.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;
      const changes = [];

      if (oldRole.name !== newRole.name) {
        changes.push(`\n **Name:**\n "${oldRole.name}" ⮕ "${newRole.name}"`);
      }

      if (oldRole.color !== newRole.color) {
        changes.push(
          `\n**Color:**\n ${oldRole.color.toString(
            16
          )} ⮕ ${newRole.color.toString(16)}`
        );
      }

      if (oldRole.mentionable !== newRole.mentionable) {
        changes.push(
          `\n**Mentionable:**\n ${oldRole.mentionable} ⮕ ${newRole.mentionable}`
        );
      }

      if (oldRole.hoist !== newRole.hoist) {
        changes.push(
          `\n**Display Separately:**\n ${oldRole.hoist} ⮕ ${newRole.hoist}`
        );
      }

      if (oldRole.permissions !== newRole.permissions) {
        const permissionsArray = newRole.permissions
          .toArray()
          .filter(
            (p: any) =>
              !oldRole.permissions.toArray().includes(p) &&
              oldRole.id === newRole.id
          )
          .map((permission: any) => {
            if (!oldRole.permissions.has(permission)) {
              return `${permission} <:toggle_on:1189788397053689866>`;
            } else {
              return `${permission} <:toggle_off:1189789052921204818>`;
            }
          });

        oldRole.permissions.toArray().forEach((permission: any) => {
          if (!newRole.permissions.has(permission)) {
            permissionsArray.push(
              `${permission} <:toggle_off:1189789052921204818>`
            );
          }
        });

        if (permissionsArray.length > 0) {
          changes.push(`\n**Permissions:**\n ${permissionsArray.join("\n")}`);
        }
      }

      if (changes.length === 0) {
        return;
      }

      const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Role Updated")
        .setDescription(
          `**Role:**\n ${newRole.name} (${newRole.id})\n${changes.join("\n")}`
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
