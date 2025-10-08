import express from "express";
import sequelize from "./db.js";
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
sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
