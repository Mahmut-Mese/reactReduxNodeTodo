import { Request, Response } from 'express';

// User types
export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserInput {
  name: string;
  email: string;
  password: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegister {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Todo types
export interface ITodo {
  id: number;
  title: string;
  description: string;
  name?: string;
  creator: number;
  tags: string[];
  imageFile?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITodoInput {
  title: string;
  description: string;
  tags: string[];
  imageFile?: string;
  name?: string;
}

export interface ITodoUpdate extends ITodoInput {
  id: number;
}

// API Response types
export interface IApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalTodos: number;
  numberOfPages: number;
}

// Request types with custom properties
export interface IAuthRequest extends Request {
  userId?: number;
}

// Controller function types
export type ControllerFunction = (req: Request, res: Response) => Promise<void>;
export type AuthControllerFunction = (req: IAuthRequest, res: Response) => Promise<void>;

// JWT payload
export interface IJwtPayload {
  email: string;
  id: number;
  iat?: number;
  exp?: number;
}

// Database connection types
export interface IDatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

// Environment variables
export interface IEnvConfig {
  MYSQL_HOST: string;
  MYSQL_PORT: number;
  MYSQL_DB: string;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  PORT: number;
  JWT_SECRET: string;
}
