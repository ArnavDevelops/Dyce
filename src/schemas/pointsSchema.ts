import { DataTypes, Model } from "sequelize";
import sequelize from "../structures/database";

interface PointsAttributes {
  guildId: string;
  userId: string;
  points: number;
}

class Points
    extends Model<PointsAttributes, PointsAttributes>
    implements PointsAttributes
{
  declare guildId: string;
  declare userId: string;
  declare points: number;
}

Points.init(
    {
      guildId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "points",
      timestamps: false,
    }
);

export default Points;