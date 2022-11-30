import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./routes/user.js";
import todoRouter from "./routes/todo.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/users", userRouter);  
app.use("/todo", todoRouter);
app.get("/", (req, res) => {
  res.send("Welcome to todo API");
});

const port = process.env.PORT || 5000;
const MONGODB_URL = 'mongodb+srv://mahmut:123@cluster0.fj6ga7f.mongodb.net/?retryWrites=true&w=majority'
mongoose
.connect(MONGODB_URL)
.then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
