import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { AcademicGradeT } from "./academic-grade.types";

export interface AcademicGradeStateT {
  academicGrades: AcademicGradeT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: AcademicGradeStateT = {
  academicGrades: [],
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "academicGrade",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<AcademicGradeT[]>) {
      state.academicGrades = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<AcademicGradeT>) {
      state.academicGrades.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<AcademicGradeT>) {
      const idx = state.academicGrades.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (idx !== -1) state.academicGrades[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.academicGrades = state.academicGrades.filter(
        (p) => p.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearAcademicGradeError(state) {
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
  clearAcademicGradeError,
} = slice.actions;

export const selectAcademicGrades = (state: RootState): AcademicGradeT[] =>
  state.institutions.academicGrade.academicGrades;
export const selectAcademicGradesStatus = (state: RootState): RequestStatusT =>
  state.institutions.academicGrade.status;
export const selectAcademicGradeError = (state: RootState): string | null =>
  state.institutions.academicGrade.error;

export const academicGradeReducer = slice.reducer;
export default slice.reducer;
