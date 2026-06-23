import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { AuthUserT } from "./auth.types";
import { tokenManager } from "./auth-token.manager";

const USER_STORAGE_KEY = "auth_user";

function loadUserFromStorage(): AuthUserT | null {
  try { const stored = localStorage.getItem(USER_STORAGE_KEY); return stored ? JSON.parse(stored) : null; }
  catch { return null; }
}

export interface AuthStateT {
  user: AuthUserT | null;
  isAuthenticated: boolean;
  status: RequestStatusT;
  error: string | null;
  isInitializing: boolean;
}

const storedUser = loadUserFromStorage();

const initialState: AuthStateT = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  status: "idle",
  error: null,
  isInitializing: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginPending(state) { state.status = "loading"; state.error = null; },
    loginSuccess(state, action: PayloadAction<{ user: AuthUserT }>) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.status = "succeeded";
      state.isInitializing = false;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user));
    },
    loginError(state, action: PayloadAction<string>) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "failed";
      state.error = action.payload;
      state.isInitializing = false;
    },
    logout(state) {
      localStorage.removeItem(USER_STORAGE_KEY);
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      state.isInitializing = false;
    },
    refreshSuccess(state, action: PayloadAction<{ user: AuthUserT }>) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.status = "succeeded";
      state.isInitializing = false;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user));
    },
    refreshError(state) {
      tokenManager.clearTokens();
      localStorage.removeItem(USER_STORAGE_KEY);
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      state.isInitializing = false;
    },
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
    userUpdated(state, action: PayloadAction<AuthUserT>) {
      state.user = action.payload;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload));
    },
  },
});

export const {
  loginPending, loginSuccess, loginError,
  logout, refreshSuccess, refreshError,
  sessionExpired, initializationComplete, userUpdated,
} = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;
export const selectAuthUser = (state: RootState): AuthUserT | null => state.auth.user;
export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState): RequestStatusT => state.auth.status;
export const selectAuthError = (state: RootState): string | null => state.auth.error;
export const selectIsInitializing = (state: RootState): boolean => state.auth.isInitializing;
export const selectMustChangePassword = createSelector(selectAuthUser, (user) => user?.must_change_password ?? false);
export const selectUserPermissions = createSelector(selectAuthUser, (user) => user?.permissions ?? []);

export const authReducer = authSlice.reducer;
export default authSlice.reducer;
