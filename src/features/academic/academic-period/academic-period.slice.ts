import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { AcademicPeriodT } from "./academic-period.types";

export interface AcademicPeriodStateT {
  academicPeriods: AcademicPeriodT[];
  totalCount: number;
  status: RequestStatusT;
  error: string | null;
}

const initialState: AcademicPeriodStateT = {
  academicPeriods: [],
  totalCount: 0,
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
    loadSuccess(
      state,
      action: PayloadAction<{ items: AcademicPeriodT[]; count: number }>,
    ) {
      state.academicPeriods = action.payload.items;
      state.totalCount = action.payload.count;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<AcademicPeriodT>) {
      state.academicPeriods.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<AcademicPeriodT>) {
      const idx = state.academicPeriods.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (idx !== -1) state.academicPeriods[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.academicPeriods = state.academicPeriods.filter(
        (p) => p.id !== action.payload,
      );
      state.status = "succeeded";
    },
    setTotalCount(state, action: PayloadAction<number>) {
      state.totalCount = action.payload;
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
  entityCreated,
  entityUpdated,
  entityDeleted,
  setTotalCount,
  mutationError,
  clearAcademicPeriodError,
} = academicPeriodSlice.actions;

export const selectAcademicPeriods = (state: RootState): AcademicPeriodT[] =>
  state.academic.academicPeriods.academicPeriods;

export const selectAcademicPeriodsStatus = (state: RootState): RequestStatusT =>
  state.academic.academicPeriods.status;

export const selectAcademicPeriodError = (state: RootState): string | null =>
  state.academic.academicPeriods.error;

export const selectAcademicPeriodTotalCount = (state: RootState): number =>
  state.academic.academicPeriods.totalCount;

export const academicPeriodsReducer = academicPeriodSlice.reducer;

export default academicPeriodSlice.reducer;
