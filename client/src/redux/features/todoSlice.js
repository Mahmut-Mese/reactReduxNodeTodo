import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

export const createTodo = createAsyncThunk(
  "todo/createTodo",
  async ({ updatedTodoData, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.createTodo(updatedTodoData);
      navigate("/");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

 

export const getTodo = createAsyncThunk(
  "todo/getTodo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getTodo(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

 

export const getTodosByUser = createAsyncThunk(
 
  "todo/getTodosByUser",
  async ({userId, currentPage }, { rejectWithValue }) => {
    try {
    //  console.log(currentPage);
      const response = await api.getTodosByUser(userId, currentPage);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todo/deleteTodo",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.deleteTodo(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todo/updateTodo",
  async ({ id, updatedTodoData, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.updateTodo(updatedTodoData, id);
      navigate("/");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const searchTodos = createAsyncThunk(
  "todo/searchTodos",
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await api.getTodosBySearch(searchQuery);
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

 
 

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todo: {},
    todos: [],
    userTodos: [],
    searches: [],
    currentPage: 1,
    numberOfPages: null,
    error: "",
    loading: false,
  },
  reducers: {
    setCurrentPage: (state, action) => {
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
        state.error = action.payload.message;
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
        state.error = action.payload.message;
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
        state.error = action.payload.message;
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
        state.error = action.payload.message;
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
        state.error = action.payload.message;
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
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = todoSlice.actions;

export default todoSlice.reducer;
