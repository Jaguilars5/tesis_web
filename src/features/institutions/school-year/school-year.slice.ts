import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { SchoolYearT } from "./school-year.types";

export interface SchoolYearStateT {
  schoolYears: SchoolYearT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: SchoolYearStateT = {
  schoolYears: [],
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "schoolYear",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<SchoolYearT[]>) {
      state.schoolYears = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<SchoolYearT>) {
      state.schoolYears.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<SchoolYearT>) {
      const idx = state.schoolYears.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (idx !== -1) state.schoolYears[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.schoolYears = state.schoolYears.filter(
        (p) => p.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearSchoolYearError(state) {
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
  clearSchoolYearError,
} = slice.actions;

export const selectSchoolYears = (state: RootState): SchoolYearT[] =>
  state.institutions.schoolYear.schoolYears;

export const selectSchoolYearsStatus = (state: RootState): RequestStatusT =>
  state.institutions.schoolYear.status;

export const selectSchoolYearError = (state: RootState): string | null =>
  state.institutions.schoolYear.error;

export const schoolYearReducer = slice.reducer;

export default slice.reducer;
