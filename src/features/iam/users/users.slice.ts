import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { UserT } from "./users.types";

export interface UserStateT {
  users: UserT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: UserStateT = {
  users: [],
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<UserT[]>) {
      state.users = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<UserT>) {
      state.users.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<UserT>) {
      const index = state.users.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) state.users[index] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.users = state.users.filter(
        (item) => item.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearUserError(state) {
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
  clearUserError,
} = userSlice.actions;

export const selectUsers = (state: RootState): UserT[] =>
  state.iam.users.users;

export const selectUsersStatus = (state: RootState): RequestStatusT =>
  state.iam.users.status;

export const selectUsersError = (state: RootState): string | null =>
  state.iam.users.error;

export const userReducer = userSlice.reducer;
export default userSlice.reducer;
