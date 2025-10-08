import express from "express";
import sequelize from "./db";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./routes/user";
import todoRouter from "./routes/todo";
import dotenv from "dotenv";
import { Request, Response } from "express";

const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb" }));
app.use(cors());

app.use("/users", userRouter);  
app.use("/todo", todoRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to todo API");
});

const port: number = parseInt(process.env.PORT || "5000", 10);

sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
