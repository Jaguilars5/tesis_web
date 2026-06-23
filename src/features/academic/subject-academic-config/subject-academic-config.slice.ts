import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { SubjectAcademicConfigT } from "./subject-academic-config.types";

export interface SubjectAcademicConfigStateT {
  subjectAcademicConfigs: SubjectAcademicConfigT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: SubjectAcademicConfigStateT = {
  subjectAcademicConfigs: [],
  status: "idle",
  error: null,
};

const subjectAcademicConfigSlice = createSlice({
  name: "subjectAcademicConfigs",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<SubjectAcademicConfigT[]>) {
      state.subjectAcademicConfigs = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    configCreated(state, action: PayloadAction<SubjectAcademicConfigT>) {
      state.subjectAcademicConfigs.unshift(action.payload);
      state.status = "succeeded";
    },
    configUpdated(state, action: PayloadAction<SubjectAcademicConfigT>) {
      const idx = state.subjectAcademicConfigs.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (idx !== -1) state.subjectAcademicConfigs[idx] = action.payload;
      state.status = "succeeded";
    },
    configDeleted(state, action: PayloadAction<number>) {
      state.subjectAcademicConfigs = state.subjectAcademicConfigs.filter(
        (p) => p.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  loadPending,
  loadSuccess,
  loadError,
  configCreated,
  configUpdated,
  configDeleted,
  mutationError,
  clearError,
} = subjectAcademicConfigSlice.actions;

export const selectSubjectAcademicConfigs = (state: RootState): SubjectAcademicConfigT[] =>
  state.academic.subjectAcademicConfigs.subjectAcademicConfigs;

export const selectSubjectAcademicConfigsStatus = (state: RootState): RequestStatusT =>
  state.academic.subjectAcademicConfigs.status;

export const selectSubjectAcademicConfigError = (state: RootState): string | null =>
  state.academic.subjectAcademicConfigs.error;

export const subjectAcademicConfigReducer = subjectAcademicConfigSlice.reducer;

export default subjectAcademicConfigSlice.reducer;
