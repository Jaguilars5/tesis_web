import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { AcademicLevelT } from "./academic-level.types";
export interface AcademicLevelStateT {
  academicLevels: AcademicLevelT[];
  status: RequestStatusT;
  error: string | null;
}
const initialState: AcademicLevelStateT = {
  academicLevels: [],
  status: "idle",
  error: null,
};
const slice = createSlice({
  name: "academicLevel",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<AcademicLevelT[]>) {
      state.academicLevels = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<AcademicLevelT>) {
      state.academicLevels.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<AcademicLevelT>) {
      const idx = state.academicLevels.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (idx !== -1) state.academicLevels[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.academicLevels = state.academicLevels.filter(
        (p) => p.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearAcademicLevelError(state) {
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
  clearAcademicLevelError,
} = slice.actions;
export const selectAcademicLevels = (state: RootState): AcademicLevelT[] =>
  state.institutions.academicLevel.academicLevels;
export const selectAcademicLevelsStatus = (state: RootState): RequestStatusT =>
  state.institutions.academicLevel.status;
export const selectAcademicLevelError = (state: RootState): string | null =>
  state.institutions.academicLevel.error;
export const academicLevelReducer = slice.reducer;
export default slice.reducer;
