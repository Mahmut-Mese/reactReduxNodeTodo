import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./features/authSlice";
import TodoReducer from "./features/todoSlice";

export default configureStore({
  reducer: {
    auth: AuthReducer,
    todo: TodoReducer,
  },
});
