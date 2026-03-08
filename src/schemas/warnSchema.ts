import { DataTypes, Model } from "sequelize";
import sequelize from "../structures/database";

interface WarningAttributes {
  id: number;
  guildId: string;
  userId: string;
  moderatorId: string;
  reason: string;
  timestamp: number;
}

class Warning
    extends Model<WarningAttributes, Omit<WarningAttributes, "id">>
    implements WarningAttributes
{
  declare id: number;
  declare guildId: string;
  declare userId: string;
  declare moderatorId: string;
  declare reason: string;
  declare timestamp: number;
}

Warning.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      guildId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      moderatorId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      timestamp: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "warning",
      timestamps: false,
    }
);

export default Warning;