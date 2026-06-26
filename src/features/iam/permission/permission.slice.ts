import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { PermissionT } from "./permission.types";

export interface PermissionStateT {
  permissions: PermissionT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: PermissionStateT = {
  permissions: [],
  status: "idle",
  error: null,
};

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<PermissionT[]>) {
      state.permissions = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<PermissionT>) {
      state.permissions.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<PermissionT>) {
      const index = state.permissions.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) state.permissions[index] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.permissions = state.permissions.filter(
        (item) => item.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearPermissionError(state) {
      state.error = null;
    },
  },
});

export const {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  clearPermissionError,
} = permissionSlice.actions;

export const selectPermissions = (state: RootState): PermissionT[] =>
  state.iam.permissions.permissions;

export const selectPermissionsStatus = (state: RootState): RequestStatusT =>
  state.iam.permissions.status;

export const selectPermissionsError = (state: RootState): string | null =>
  state.iam.permissions.error;

export const permissionReducer = permissionSlice.reducer;
export default permissionSlice.reducer;
