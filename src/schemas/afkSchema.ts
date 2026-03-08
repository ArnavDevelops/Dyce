import { DataTypes, Model } from "sequelize";
import sequelize from "../structures/database";

interface AfkAttributes {
  userId: string;
  guildId: string;
  reason: string | null;
  date: number;
  nickname: string | null;
}

class Afk extends Model<AfkAttributes> implements AfkAttributes {
  declare userId: string;
  declare guildId: string;
  declare reason: string | null;
  declare date: number;
  declare nickname: string | null;
}

Afk.init(
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      guildId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { sequelize, modelName: "afk", timestamps: false }
);

export default Afk;