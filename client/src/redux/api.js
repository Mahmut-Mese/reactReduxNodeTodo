import axios from "axios";



const API = axios.create({
  baseURL: `http://localhost:5000`,
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

export const signIn = (formData) => API.post("/users/signin", formData);
export const signUp = (formData) => API.post("/users/signup", formData);
 
export const createTodo = (todoData) => API.post("/todo", todoData);
export const getTodo = (id) => API.get(`/todo/${id}`);
export const deleteTodo = (id) => API.delete(`/todo/${id}`);
export const updateTodo = (updatedTodoData, id) =>
  API.patch(`/todo/${id}`, updatedTodoData);
export const getTodosByUser = (userId, page) => API.get(`/todo/userTodos/${userId}?page=${page}`);

export const getTodosBySearch = (searchQuery) =>
  API.get(`/todo/search?searchQuery=${searchQuery}`);

