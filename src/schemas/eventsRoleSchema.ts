import { DataTypes, Model } from "sequelize";
import sequelize from "../structures/database";

interface EventRoleAttributes {
  guildId: string;
  roleId: string;
}

class EventRole
    extends Model<EventRoleAttributes, EventRoleAttributes>
    implements EventRoleAttributes
{
  declare guildId: string;
  declare roleId: string;
}

EventRole.init(
    {
      guildId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "eventRole",
      timestamps: false,
    }
);

export default EventRole;