import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import { ITodo, ITodoInput } from "../types";

interface TodoCreationAttributes {
  id?: number;
  title: string;
  description: string;
  name?: string;
  creator: number;
  tags: string[];
  imageFile?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Todo extends Model<ITodo, TodoCreationAttributes> implements ITodo {
  public id!: number;
  public title!: string;
  public description!: string;
  public name?: string;
  public creator!: number;
  public tags!: string[];
  public imageFile?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Todo.init(
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
      get(): string[] | null {
        const rawValue = this.getDataValue('tags') as any;
        if (rawValue && typeof rawValue === 'string') {
          try {
            return JSON.parse(rawValue);
          } catch (e) {
            return rawValue.split(',').filter((tag: string) => tag.trim());
          }
        }
        return rawValue;
      },
      set(value: string[] | string | null): void {
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
    sequelize,
    tableName: "todos",
    timestamps: true,
    underscored: true,
  }
);

export default Todo;
