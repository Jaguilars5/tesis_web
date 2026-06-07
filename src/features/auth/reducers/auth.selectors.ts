import type { RootState } from "@shared/redux/store";

export const selectAuthState = (state: RootState) => state.auth;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsInitializing = (state: RootState) => state.auth.isInitializing;
export const selectUserPermissions = (state: RootState): string[] =>
  state.auth.user?.permissions ?? [];
