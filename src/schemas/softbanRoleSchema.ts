import { DataTypes, Model } from "sequelize";
import sequelize from "../structures/database";

interface SoftbanRoleAttributes {
  guildId: string;
  roleId: string;
}

class SoftbanRole
    extends Model<SoftbanRoleAttributes, SoftbanRoleAttributes>
    implements SoftbanRoleAttributes
{
  declare guildId: string;
  declare roleId: string;
}

SoftbanRole.init(
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
      modelName: "softbanRole",
      timestamps: false,
    }
);

export default SoftbanRole;