import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { RoleT } from "./roles.types";

export interface RoleStateT {
  roles: RoleT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: RoleStateT = {
  roles: [],
  status: "idle",
  error: null,
};

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<RoleT[]>) {
      state.roles = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<RoleT>) {
      state.roles.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<RoleT>) {
      const index = state.roles.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) state.roles[index] = action.payload;
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearRoleError(state) {
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
  mutationError,
  clearRoleError,
} = roleSlice.actions;

export const selectRoles = (state: RootState): RoleT[] =>
  state.iam.roles.roles;

export const selectRolesStatus = (state: RootState): RequestStatusT =>
  state.iam.roles.status;

export const selectRolesError = (state: RootState): string | null =>
  state.iam.roles.error;

export const roleReducer = roleSlice.reducer;
export default roleSlice.reducer;
