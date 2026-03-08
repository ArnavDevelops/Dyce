import { DataTypes, Model } from "sequelize";
import sequelize from "../structures/database";

interface AutoPublishAttributes {
  guildId: string;
  channelId: string;
}

class AutoPublish
    extends Model<AutoPublishAttributes, AutoPublishAttributes>
    implements AutoPublishAttributes
{
  declare guildId: string;
  declare channelId: string | null;
}

AutoPublish.init(
    {
      guildId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      channelId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "autopublish",
      timestamps: false,
    }
);

export default AutoPublish;