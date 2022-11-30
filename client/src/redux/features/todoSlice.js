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
  extraReducers: {
    [createTodo.pending]: (state, action) => {
      state.loading = true;
    },
    [createTodo.fulfilled]: (state, action) => {
      state.loading = false;
      state.todos = [action.payload];
    },
    [createTodo.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [getTodo.pending]: (state, action) => {
      state.loading = true;
    },
    [getTodo.fulfilled]: (state, action) => {
      state.loading = false;
      state.todo = action.payload;
    },
    [getTodo.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [getTodosByUser.pending]: (state, action) => {
      state.loading = true;
    },
    [getTodosByUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.userTodos = action.payload.data;
      state.numberOfPages = action.payload.numberOfPages;
      state.currentPage = action.payload.currentPage;
    },
    [getTodosByUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [deleteTodo.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteTodo.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.userTodos = state.userTodos.filter((item) => item._id !== id);
        state.todos = state.todos.filter((item) => item._id !== id);
      }
    },
    [deleteTodo.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [updateTodo.pending]: (state, action) => {
      state.loading = true;
    },
    [updateTodo.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.userTodos = state.userTodos.map((item) =>
          item._id === id ? action.payload : item
        );
        state.todos = state.todos.map((item) =>
          item._id === id ? action.payload : item
        );
      }
    },
    [updateTodo.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },


    [searchTodos.pending]: (state, action) => {
      state.loading = true;
    },
    [searchTodos.fulfilled]: (state, action) => {
      state.loading = false;
      state.searches = action.payload;

    },
    [searchTodos.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    }
  },
});

export const { setCurrentPage } = todoSlice.actions;

export default todoSlice.reducer;
