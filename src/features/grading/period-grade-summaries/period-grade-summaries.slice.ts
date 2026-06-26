import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { PeriodGradeSummaryT } from "./period-grade-summaries.types";

export interface PeriodGradeSummariesStateT {
  periodGradeSummaries: PeriodGradeSummaryT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: PeriodGradeSummariesStateT = {
  periodGradeSummaries: [],
  status: "idle",
  error: null,
};

const periodGradeSummariesSlice = createSlice({
  name: "periodGradeSummaries",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<PeriodGradeSummaryT[]>) {
      state.periodGradeSummaries = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<PeriodGradeSummaryT>) {
      state.periodGradeSummaries.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<PeriodGradeSummaryT>) {
      const index = state.periodGradeSummaries.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) state.periodGradeSummaries[index] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.periodGradeSummaries = state.periodGradeSummaries.filter(
        (item) => item.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearPeriodGradeSummariesError(state) {
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
  clearPeriodGradeSummariesError,
} = periodGradeSummariesSlice.actions;

export const selectPeriodGradeSummaries = (state: RootState): PeriodGradeSummaryT[] =>
  state.grading.periodGradeSummaries.periodGradeSummaries;

export const selectPeriodGradeSummariesStatus = (state: RootState): RequestStatusT =>
  state.grading.periodGradeSummaries.status;

export const selectPeriodGradeSummariesError = (state: RootState): string | null =>
  state.grading.periodGradeSummaries.error;

export const periodGradeSummariesReducer = periodGradeSummariesSlice.reducer;
export default periodGradeSummariesSlice.reducer;
