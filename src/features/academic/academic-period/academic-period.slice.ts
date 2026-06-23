import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { AcademicPeriodT } from "./academic-period.types";

export interface AcademicPeriodStateT {
  academicPeriods: AcademicPeriodT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: AcademicPeriodStateT = {
  academicPeriods: [],
  status: "idle",
  error: null,
};

const academicPeriodSlice = createSlice({
  name: "academicPeriods",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<AcademicPeriodT[]>) {
      state.academicPeriods = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    periodCreated(state, action: PayloadAction<AcademicPeriodT>) {
      state.academicPeriods.unshift(action.payload);
      state.status = "succeeded";
    },
    periodUpdated(state, action: PayloadAction<AcademicPeriodT>) {
      const idx = state.academicPeriods.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (idx !== -1) state.academicPeriods[idx] = action.payload;
      state.status = "succeeded";
    },
    periodDeleted(state, action: PayloadAction<number>) {
      state.academicPeriods = state.academicPeriods.filter(
        (p) => p.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearAcademicPeriodError(state) {
      state.error = null;
    },
  },
});

export const {
  loadPending,
  loadSuccess,
  loadError,
  periodCreated,
  periodUpdated,
  periodDeleted,
  mutationError,
  clearAcademicPeriodError,
} = academicPeriodSlice.actions;

export const selectAcademicPeriods = (state: RootState): AcademicPeriodT[] =>
  state.academic.academicPeriods.academicPeriods;

export const selectAcademicPeriodsStatus = (state: RootState): RequestStatusT =>
  state.academic.academicPeriods.status;

export const selectAcademicPeriodError = (state: RootState): string | null =>
  state.academic.academicPeriods.error;

export const academicPeriodsReducer = academicPeriodSlice.reducer;

export default academicPeriodSlice.reducer;
