import { Response } from "express";
import { Op } from 'sequelize';
import Todo from "../models/todo";
import sequelize from "../db";
import { IAuthRequest, ITodoInput, IApiResponse, IPaginatedResponse } from "../types";

export const createTodo = async (req: IAuthRequest, res: Response): Promise<void> => {
  const todo: ITodoInput = req.body;
  
  try {
    const newTodo = await Todo.create({
      ...todo,
      creator: req.userId!,
    });
    res.status(201).json(newTodo);
  } catch (error: any) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      sql: error.sql,
      original: error.original
    });
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const getTodo = async (req: IAuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const todoItem = await Todo.findByPk(parseInt(id));
    if (!todoItem) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    res.status(200).json(todoItem);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getTodosByUser = async (req: IAuthRequest, res: Response): Promise<void> => {
  console.log(req.query);
  const { id } = req.params;
  const { page } = req.query;
  const limit = 5;
  const startIndex = (Number(page) - 1) * limit;
  
  try {
    const { count, rows: userTodos } = await Todo.findAndCountAll({
      where: { creator: parseInt(id) },
      limit,
      offset: startIndex,
      order: [["created_at", "DESC"]],
    });

    const response: IPaginatedResponse<typeof userTodos[0]> = {
      data: userTodos,
      currentPage: Number(page),
      totalTodos: count,
      numberOfPages: Math.ceil(count / limit),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const deleteTodo = async (req: IAuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const deleted = await Todo.destroy({ where: { id: parseInt(id) } });
    if (deleted) {
      res.json({ message: "Todo deleted successfully" });
    } else {
      res.status(404).json({ message: `No todo exist with id: ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const updateTodo = async (req: IAuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, creator, imageFile, tags }: ITodoInput & { creator?: number } = req.body;
  
  try {
    const updatedTodo = {
      creator: creator || req.userId!,
      title,
      description,
      tags,
      imageFile,
    };

    const [rowsAffected] = await Todo.update(updatedTodo, {
      where: { id: parseInt(id) },
    });

    if (rowsAffected > 0) {
      const updated = await Todo.findByPk(parseInt(id));
      res.json(updated);
    } else {
      res.status(404).json({ message: `No todo exist with id: ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getTodosBySearch = async (req: IAuthRequest, res: Response): Promise<void> => {
  const { searchQuery } = req.query;
  try {
    const todos = await Todo.findAll({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("title")),
        "LIKE",
        `%${String(searchQuery || "").toLowerCase()}%`
      ),
      limit: 25,
      order: [["created_at", "DESC"]],
    });
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};
