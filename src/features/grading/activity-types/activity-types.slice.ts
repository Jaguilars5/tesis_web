import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { ActivityTypeT } from "./activity-types.types";

export interface ActivityTypesStateT {
  items: ActivityTypeT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: ActivityTypesStateT = {
  items: [],
  status: "idle",
  error: null,
};

const activityTypesSlice = createSlice({
  name: "activityTypes",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<ActivityTypeT[]>) {
      state.items = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<ActivityTypeT>) {
      state.items.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<ActivityTypeT>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearActivityTypesError(state) {
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
  clearActivityTypesError,
} = activityTypesSlice.actions;

export const selectItems = (state: RootState): ActivityTypeT[] =>
  state.grading.activityTypes.items;
export const selectStatus = (state: RootState): RequestStatusT =>
  state.grading.activityTypes.status;
export const selectError = (state: RootState): string | null =>
  state.grading.activityTypes.error;

export const activityTypesReducer = activityTypesSlice.reducer;
export default activityTypesSlice.reducer;
