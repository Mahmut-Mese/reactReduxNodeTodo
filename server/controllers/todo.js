import TodoModal from "../models/todo.js";
import mongoose from "mongoose";

export const createTodo = async (req, res) => {
  const todo = req.body;
  const newTodo = new TodoModal({
    ...todo,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};



export const getTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await TodoModal.findById(id);
    res.status(200).json(todo);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getTodosByUser = async (req, res) => {
  console.log(req.query);
  const { id } = req.params;
  const { page } = req.query;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "User doesn't exist" });
  }
  const limit = 5;
  const startIndex = (Number(page) - 1) * limit;
  const total = await TodoModal.countDocuments({});
  const userTodos = await TodoModal.find({ creator: id }).limit(limit).skip(startIndex);
  res.status(200).json({     data: userTodos,
    currentPage: Number(page),
    totalTodos: total,
    numberOfPages: Math.ceil(total / limit),});
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No todo exist with id: ${id}` });
    }
    await TodoModal.findByIdAndRemove(id);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, creator, imageFile, tags } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No todo exist with id: ${id}` });
    }

    const updatedTodo = {
      creator,
      title,
      description,
      tags,
      imageFile,
      _id: id,
    };
    await TodoModal.findByIdAndUpdate(id, updatedTodo, { new: true });
    res.json(updatedTodo);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getTodosBySearch = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    const todos = await TodoModal.find({ title });
      res.json(todos);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

 
 
 
