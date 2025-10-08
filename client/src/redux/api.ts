import axios, { AxiosResponse } from "axios";
import { LoginCredentials, RegisterCredentials, CreateTodoData, Todo, PaginatedResponse } from "../types";

const API = axios.create({
  baseURL: `http://localhost:5002`,
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile") || "{}").token
    }`;
  }
  return req;
});

export const signIn = (formData: LoginCredentials): Promise<AxiosResponse<{ result: any; token: string }>> => 
  API.post("/users/signin", formData);

export const signUp = (formData: RegisterCredentials): Promise<AxiosResponse<{ result: any; token: string }>> => 
  API.post("/users/signup", formData);
 
export const createTodo = (todoData: CreateTodoData): Promise<AxiosResponse<Todo>> => 
  API.post("/todo", todoData);

export const getTodo = (id: number): Promise<AxiosResponse<Todo>> => 
  API.get(`/todo/${id}`);

export const deleteTodo = (id: number): Promise<AxiosResponse<{ message: string }>> => 
  API.delete(`/todo/${id}`);

export const updateTodo = (updatedTodoData: CreateTodoData, id: number): Promise<AxiosResponse<Todo>> =>
  API.patch(`/todo/${id}`, updatedTodoData);

export const getTodosByUser = (userId: number, page: number): Promise<AxiosResponse<PaginatedResponse<Todo>>> => 
  API.get(`/todo/userTodos/${userId}?page=${page}`);

export const getTodosBySearch = (searchQuery: string): Promise<AxiosResponse<Todo[]>> =>
  API.get(`/todo/search?searchQuery=${searchQuery}`);
