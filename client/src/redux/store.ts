import { configureStore } from "@reduxjs/toolkit";
import { ThunkAction, Action } from "@reduxjs/toolkit";
import AuthReducer from "./features/authSlice";
import TodoReducer from "./features/todoSlice";
import { AuthState, TodoState } from "../types";

export interface RootState {
  auth: AuthState;
  todo: TodoState;
}

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    todo: TodoReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
