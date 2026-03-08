import { DataTypes, Model } from "sequelize";
import sequelize from "../structures/database";

interface LoggingAttributes {
  Guild: string;
  Channel: string;
}

class Logging
    extends Model<LoggingAttributes, LoggingAttributes>
    implements LoggingAttributes
{
  declare Guild: string;
  declare Channel: string;
}

Logging.init(
    {
      Guild: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      Channel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "logging",
      timestamps: false,
    }
);

export default Logging;