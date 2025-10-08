import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../api";
import { LoginCredentials, RegisterCredentials, AuthState, NavigateFunction, AuthUser } from "../../types";

interface LoginParams {
  formValue: LoginCredentials;
  navigate: NavigateFunction;
}

interface RegisterParams {
  formValue: RegisterCredentials;
  navigate: NavigateFunction;
}

export const login = createAsyncThunk<AuthUser, LoginParams, { rejectValue: string }>(
  "auth/login",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.signIn(formValue);
      navigate("/");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk<AuthUser, RegisterParams, { rejectValue: string }>(
  "auth/register",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.signUp(formValue);
      navigate("/");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);
 

const initialState: AuthState = {
  user: null,
  error: "",
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      localStorage.clear();
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { setUser, setLogout } = authSlice.actions;

export default authSlice.reducer;
