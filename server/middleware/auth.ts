import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IAuthRequest, IJwtPayload } from "../types";

const secret = "test";

const auth = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }
    
    const isCustomAuth = token.length < 500;
    let decodedData: IJwtPayload;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret) as IJwtPayload;
      req.userId = decodedData?.id;
    }  
    next();
  } catch (error) {
    console.log('Auth error:', error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;
