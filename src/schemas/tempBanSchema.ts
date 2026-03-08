import { DataTypes, Model } from "sequelize";
import sequelize from "../structures/database";

interface TempBanAttributes {
  guildId: string;
  userId: string;
  time: number;
}

class TempBan
    extends Model<TempBanAttributes, TempBanAttributes>
    implements TempBanAttributes
{
  declare guildId: string;
  declare userId: string;
  declare time: number;
}

TempBan.init(
    {
      guildId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      time: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "tempBan",
      timestamps: false,
    }
);

export default TempBan;