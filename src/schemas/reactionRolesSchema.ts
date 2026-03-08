import { DataTypes, Model } from "sequelize";
import sequelize from "../structures/database";

interface ReactionRoleAttributes {
    guildId: string;
    channelId: string;
    msgId: string;
    role1: string | null;
    role2: string | null;
    role3: string | null;
    role4: string | null;
}

class ReactionRole
    extends Model<ReactionRoleAttributes, ReactionRoleAttributes>
    implements ReactionRoleAttributes
{
    declare guildId: string;
    declare channelId: string;
    declare msgId: string;
    declare role1: string | null;
    declare role2: string | null;
    declare role3: string | null;
    declare role4: string | null;
}

ReactionRole.init(
    {
        guildId: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        channelId: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        msgId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        role1: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        role2: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        role3: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        role4: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "reactionrole",
        timestamps: false,
    }
);

export default ReactionRole;