import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../api";
import { Todo, TodoState, CreateTodoData, NavigateFunction } from "../../types";

interface CreateTodoParams {
  updatedTodoData: CreateTodoData;
  navigate: NavigateFunction;
}

interface GetTodosByUserParams {
  userId: number;
  currentPage: number;
}

interface DeleteTodoParams {
  id: number;
}

interface UpdateTodoParams {
  id: number;
  updatedTodoData: CreateTodoData;
  navigate: NavigateFunction;
}

export const createTodo = createAsyncThunk<Todo, CreateTodoParams, { rejectValue: string }>(
  "todo/createTodo",
  async ({ updatedTodoData, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.createTodo(updatedTodoData);
      navigate("/");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create todo");
    }
  }
);

export const getTodo = createAsyncThunk<Todo, number, { rejectValue: string }>(
  "todo/getTodo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getTodo(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to get todo");
    }
  }
);

export const getTodosByUser = createAsyncThunk<{ data: Todo[]; currentPage: number; totalTodos: number; numberOfPages: number }, GetTodosByUserParams, { rejectValue: string }>(
  "todo/getTodosByUser",
  async ({ userId, currentPage }, { rejectWithValue }) => {
    try {
      const response = await api.getTodosByUser(userId, currentPage);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to get user todos");
    }
  }
);

export const deleteTodo = createAsyncThunk<{ message: string }, DeleteTodoParams, { rejectValue: string }>(
  "todo/deleteTodo",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.deleteTodo(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete todo");
    }
  }
);

export const updateTodo = createAsyncThunk<Todo, UpdateTodoParams, { rejectValue: string }>(
  "todo/updateTodo",
  async ({ id, updatedTodoData, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.updateTodo(updatedTodoData, id);
      navigate("/");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update todo");
    }
  }
);

export const searchTodos = createAsyncThunk<Todo[], string, { rejectValue: string }>(
  "todo/searchTodos",
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await api.getTodosBySearch(searchQuery);
      console.log(response.data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to search todos");
    }
  }
);

const initialState: TodoState = {
  todo: null,
  todos: [],
  userTodos: [],
  searches: [],
  currentPage: 1,
  numberOfPages: null,
  error: "",
  loading: false,
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = [action.payload];
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create todo";
      })
      .addCase(getTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todo = action.payload;
      })
      .addCase(getTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get todo";
      })
      .addCase(getTodosByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTodosByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userTodos = action.payload.data;
        state.numberOfPages = action.payload.numberOfPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getTodosByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get user todos";
      })
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.userTodos = state.userTodos.filter((item) => item.id !== id);
          state.todos = state.todos.filter((item) => item.id !== id);
        }
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete todo";
      })
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.userTodos = state.userTodos.map((item) =>
            item.id === id ? action.payload : item
          );
          state.todos = state.todos.map((item) =>
            item.id === id ? action.payload : item
          );
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update todo";
      })
      .addCase(searchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.searches = action.payload;
      })
      .addCase(searchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to search todos";
      });
  },
});

export const { setCurrentPage } = todoSlice.actions;

export default todoSlice.reducer;
