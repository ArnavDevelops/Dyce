import {
  EmbedBuilder,
  NonThreadGuildBasedChannel,
  TextChannel,
} from "discord.js";
import logSchema from "../../schemas/logSchema";
import { Event } from "../../structures/Event";

export default new Event(
  "channelUpdate",
  async (
    oldChannel: NonThreadGuildBasedChannel,
    newChannel: NonThreadGuildBasedChannel
  ) => {
    try {
      const logData = await logSchema.findOne({ Guild: newChannel.guild.id });
      if (!logData) return;

      const logChannel = newChannel.guild.channels.cache.get(
        logData.Channel
      ) as TextChannel;
      if (!logChannel) return;

      const changes = [];
      if (oldChannel.name !== newChannel.name) {
        changes.push(`\n**Name:**\n ${oldChannel.name} ⮕ ${newChannel.name}`);
      }
      if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
        let permArray = [] as any;
        newChannel.permissionOverwrites.cache.forEach(
          async (newOverwrite: any) => {
            if (newOverwrite.type === 0) {
              const oldOverwrite = oldChannel.permissionOverwrites.cache.get(
                newOverwrite.id
              );

              const newlyGrantedPermissions = newOverwrite.allow
                .toArray()
                .filter((perm: any) => !oldOverwrite.allow.has(perm));
              const newlyDeniedPermissions = newOverwrite.deny
                .toArray()
                .filter((perm: any) => !oldOverwrite.deny.has(perm));
              const defaultPermissions = oldOverwrite.allow
                .toArray()
                .filter(
                  (perm: any) =>
                    !newOverwrite.allow.has(perm) &&
                    !newOverwrite.deny.has(perm)
                )
                .concat(
                  oldOverwrite.deny
                    .toArray()
                    .filter(
                      (perm: any) =>
                        !newOverwrite.deny.has(perm) &&
                        !newOverwrite.allow.has(perm)
                    )
                );

              if (
                newlyGrantedPermissions.length > 0 ||
                newlyDeniedPermissions.length > 0 ||
                defaultPermissions.length > 0
              ) {
                const role = newChannel.guild.roles.cache.get(newOverwrite.id);
                const roleName = role
                  ? `<@&${role.id}>`
                  : `ID: ${newOverwrite.id}`;

                newlyGrantedPermissions.forEach((perm: any) => {
                  permArray.push(
                    `${perm} <:channelperms_check:1189801438679941230> `
                  );
                });

                newlyDeniedPermissions.forEach((perm: any) => {
                  permArray.push(
                    `${perm} <:channelperms_x:1189801446946906132>`
                  );
                });

                defaultPermissions.forEach((perm: any) => {
                  permArray.push(
                    `${perm} <:channelperms_default:1189801442735824937> `
                  );
                });
                // Add the changes for this role to the changes array
                changes.push(
                  `\n**Permissions**:\n${roleName}:\n\n${permArray.join("\n")}`
                );
              }
            }
          }
        );
      }

      if (changes.length === 0) return;

      const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Channel Updated")
        .setDescription(
          `**Channel:**\n ${newChannel} (${newChannel.id})\n${changes.join(
            "\n"
          )}`
        )
        .setFooter({
          text: "Dyce#3312",
          iconURL:
            "https://cdn.discordapp.com/attachments/1230995581703557163/1231156505580011613/pngimg.com_-_dice_PNG49.png?ex=6635eed8&is=662379d8&hm=1164fed4c3fe58ec4e9f18378e74e938f21f3dd513c06085d1ae336c1c55a63c&",
        })
        .setTimestamp();

      await logChannel.send({ content: ``, embeds: [embed] });
    } catch (err) {
      return;
    }
  }
);
