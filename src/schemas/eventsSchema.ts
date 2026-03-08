import { DataTypes, Model } from "sequelize";
import sequelize from "../structures/database";

interface EventAttributes {
  guildId: string;
  msgId: string;
  threadId: string;
  title: string;
  description: string;
  joiningList: string[];
  notJoiningList: string[];
  neutralList: string[];
  startTime: number;
  endTime: number;
  timeItStarts: number;
}

class Event
    extends Model<EventAttributes, EventAttributes>
    implements EventAttributes
{
  declare guildId: string;
  declare msgId: string;
  declare threadId: string;
  declare title: string;
  declare description: string;

  declare joiningList: string[];
  declare notJoiningList: string[];
  declare neutralList: string[];

  declare startTime: number;
  declare endTime: number;
  declare timeItStarts: number;
}

Event.init(
    {
      guildId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      msgId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      threadId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      joiningList: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },

      notJoiningList: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },

      neutralList: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },

      startTime: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },

      endTime: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },

      timeItStarts: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "event",
      timestamps: false,
    }
);

export default Event;