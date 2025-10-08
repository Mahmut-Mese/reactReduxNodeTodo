import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Todo = sequelize.define(
  "Todo",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creator: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('tags');
        if (rawValue && typeof rawValue === 'string') {
          try {
            return JSON.parse(rawValue);
          } catch (e) {
            return rawValue.split(',').filter(tag => tag.trim());
          }
        }
        return rawValue;
      },
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue('tags', JSON.stringify(value));
        } else if (typeof value === 'string') {
          this.setDataValue('tags', value);
        } else {
          this.setDataValue('tags', null);
        }
      }
    },
    imageFile: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
  },
  {
    tableName: "todos",
    timestamps: true,
    underscored: true,
  }
);

export default Todo;
