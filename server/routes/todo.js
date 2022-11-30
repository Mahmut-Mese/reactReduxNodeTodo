import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";

import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodosBySearch,
  getTodosByUser,
  updateTodo,
} from "../controllers/todo.js";

router.get("/search", getTodosBySearch);
router.get("/:id", getTodo);

router.post("/", auth, createTodo);
router.delete("/:id", auth, deleteTodo);
router.patch("/:id", auth, updateTodo);
router.get("/userTodos/:id", auth, getTodosByUser);

export default router;
