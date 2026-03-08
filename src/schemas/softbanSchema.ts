import { DataTypes, Model } from "sequelize";
import sequelize from "../structures/database";

interface SoftbanAttributes {
  guildId: string;
  userId: string;
  duration: string;
}

class Softban
    extends Model<SoftbanAttributes, SoftbanAttributes>
    implements SoftbanAttributes
{
  declare guildId: string;
  declare userId: string;
  declare duration: string;
}

Softban.init(
    {
      guildId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "softban",
      timestamps: false,
    }
);

export default Softban;