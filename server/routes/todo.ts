import express from "express";
import auth from "../middleware/auth";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodosBySearch,
  getTodosByUser,
  updateTodo,
} from "../controllers/todo";

const router = express.Router();

router.get("/search", getTodosBySearch);
router.get("/:id", getTodo);

router.post("/", auth, createTodo);
router.delete("/:id", auth, deleteTodo);
router.patch("/:id", auth, updateTodo);
router.get("/userTodos/:id", auth, getTodosByUser);

export default router;
