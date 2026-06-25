import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { AcademicSubLevelT } from "./academic-sublevel.types";

export interface AcademicSubLevelStateT {
  academicSubLevels: AcademicSubLevelT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: AcademicSubLevelStateT = {
  academicSubLevels: [],
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "academicSubLevel",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<AcademicSubLevelT[]>) {
      state.academicSubLevels = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<AcademicSubLevelT>) {
      state.academicSubLevels.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<AcademicSubLevelT>) {
      const idx = state.academicSubLevels.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (idx !== -1) state.academicSubLevels[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.academicSubLevels = state.academicSubLevels.filter(
        (p) => p.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearAcademicSubLevelError(state) {
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
  clearAcademicSubLevelError,
} = slice.actions;

export const selectAcademicSubLevels = (state: RootState): AcademicSubLevelT[] =>
  state.institutions.academicSubLevel.academicSubLevels;

export const selectAcademicSubLevelsStatus = (state: RootState): RequestStatusT =>
  state.institutions.academicSubLevel.status;

export const selectAcademicSubLevelError = (state: RootState): string | null =>
  state.institutions.academicSubLevel.error;

export const academicSubLevelReducer = slice.reducer;
export default slice.reducer;
