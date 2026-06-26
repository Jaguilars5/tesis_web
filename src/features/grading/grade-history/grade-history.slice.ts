import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { GradeChangeHistoryT } from "./grade-history.types";

export interface GradeHistoryStateT {
  items: GradeChangeHistoryT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: GradeHistoryStateT = {
  items: [],
  status: "idle",
  error: null,
};

const gradeHistorySlice = createSlice({
  name: "gradeHistory",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<GradeChangeHistoryT[]>) { state.items = action.payload; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    itemLoaded(state, action: PayloadAction<GradeChangeHistoryT>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      else state.items.unshift(action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearGradeHistoryError(state) { state.error = null; },
  },
});

export const {
  loadPending, loadSuccess, loadError,
  itemLoaded, mutationError, clearGradeHistoryError,
} = gradeHistorySlice.actions;

export const selectItems = (state: RootState): GradeChangeHistoryT[] => state.grading.gradeHistory.items;
export const selectStatus = (state: RootState): RequestStatusT => state.grading.gradeHistory.status;
export const selectError = (state: RootState): string | null => state.grading.gradeHistory.error;

export const gradeHistoryReducer = gradeHistorySlice.reducer;
export default gradeHistorySlice.reducer;
