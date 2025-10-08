import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/user";
import { IUserLogin, IUserRegister, IApiResponse, IJwtPayload, IUser } from "../types";

const secret = "test";

export const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: IUserLogin = req.body;

  try {
    const oldUser = await User.findOne({ where: { email } });
    if (!oldUser) {
      res.status(404).json({ message: "User doesn't exist" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ result: oldUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName }: IUserRegister = req.body;
  
  try {
    const oldUser = await User.findOne({ where: { email } });

    if (oldUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result.id }, secret, {
      expiresIn: "1h",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
