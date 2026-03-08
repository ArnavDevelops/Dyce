import { DataTypes, Model } from "sequelize";
import sequelize from "../structures/database";

interface JoinRoleAttributes {
    guildId: string;
    roleId: string;
}

class JoinRole
    extends Model<JoinRoleAttributes, JoinRoleAttributes>
    implements JoinRoleAttributes
{
    declare guildId: string;
    declare roleId: string;
}

JoinRole.init(
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
        modelName: "joinRole",
        timestamps: false,
    }
);

export default JoinRole;