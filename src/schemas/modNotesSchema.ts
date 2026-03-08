import { DataTypes, Model } from "sequelize";
import sequelize from "../structures/database";

interface ModNotesAttributes {
  id: number;
  guildId: string;
  moderatorId: string;
  command: string;
  date: number;
  note: string;
}

class ModNotes
    extends Model<ModNotesAttributes, Omit<ModNotesAttributes, "id">>
    implements ModNotesAttributes
{
  declare id: number;
  declare guildId: string;
  declare moderatorId: string;
  declare command: string;
  declare date: number;
  declare note: string;
}

ModNotes.init(
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

      moderatorId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      command: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      date: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },

      note: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "modNotes",
      timestamps: false,
    }
);

export default ModNotes;