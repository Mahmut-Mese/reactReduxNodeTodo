import Todo from "../models/todo.js";
import sequelize from "../db.js";

export const createTodo = async (req, res) => {
  const todo = req.body;
  
  try {
    const newTodo = await Todo.create({
      ...todo,
      creator: req.userId,
    });
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      sql: error.sql,
      original: error.original
    });
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};



export const getTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const todoItem = await Todo.findByPk(id);
    res.status(200).json(todoItem);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getTodosByUser = async (req, res) => {
  console.log(req.query);
  const { id } = req.params;
  const { page } = req.query;
  const limit = 5;
  const startIndex = (Number(page) - 1) * limit;
  const total = await Todo.count();
  const userTodos = await Todo.findAll({
    where: { creator: id },
    limit,
    offset: startIndex,
    order: [["created_at", "DESC"]],
  });
  res.status(200).json({     data: userTodos,
    currentPage: Number(page),
    totalTodos: total,
    numberOfPages: Math.ceil(total / limit),});
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    await Todo.destroy({ where: { id } });
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, creator, imageFile, tags } = req.body;
  try {
    await Todo.update(
      { creator, title, description, tags, imageFile },
      { where: { id } }
    );
    const updated = await Todo.findByPk(id);
    res.json(updated);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getTodosBySearch = async (req, res) => {
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
    res.status(404).json({ message: "Something went wrong" });
  }
};

 
 
 
