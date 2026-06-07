import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { AUTH_THUNKS } from "../constants/auth.constants";
import type { LoginParamsT } from "../domain/entities/auth.types";
import type { AuthResultT } from "../domain/entities/auth.types";
import { tokenManager } from "../infrastructure/repositories/auth-token.repository";
import type { AuthUserT } from "../domain/entities/auth.types";
import type { AuthStateT } from "./auth.reducer.types";
import { loginUseCase } from "../application/use-cases/login.usecase";
import { logoutUseCase } from "../application/use-cases/logout.usecase";
import { refreshSessionUseCase } from "../application/use-cases/refresh-session.usecase";

const USER_STORAGE_KEY = "auth_user";

const loadUserFromStorage = (): AuthUserT | null => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const storedUser = loadUserFromStorage();

const initialState: AuthStateT = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  status: "idle",
  error: null,
  isInitializing: true,
};

export const login = createAsyncThunk<
  AuthResultT,
  LoginParamsT,
  { rejectValue: string }
>(AUTH_THUNKS.LOGIN, async (credentials, { rejectWithValue }) => {
  try {
    return await loginUseCase(credentials);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const logout = createAsyncThunk(AUTH_THUNKS.LOGOUT, async () => {
  await logoutUseCase();
});

export const refreshSession = createAsyncThunk<
  AuthResultT,
  void,
  { rejectValue: string }
>(AUTH_THUNKS.REFRESH_SESSION, async (_, { rejectWithValue }) => {
  try {
    return await refreshSessionUseCase();
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionExpired(state) {
      tokenManager.clearTokens();
      localStorage.removeItem(USER_STORAGE_KEY);
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      state.isInitializing = false;
    },
    initializationComplete(state) {
      state.isInitializing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.isInitializing = false;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "failed";
        state.error = action.payload ?? "Credenciales invalidas";
        state.isInitializing = false;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem(USER_STORAGE_KEY);
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
        state.isInitializing = false;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.isInitializing = false;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user));
      })
      .addCase(refreshSession.rejected, (state) => {
        tokenManager.clearTokens();
        localStorage.removeItem(USER_STORAGE_KEY);
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
        state.isInitializing = false;
      });
  },
});

export const { sessionExpired, initializationComplete } = authSlice.actions;
export default authSlice.reducer;
