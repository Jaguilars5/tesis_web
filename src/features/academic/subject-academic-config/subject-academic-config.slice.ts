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
    entityCreated(state, action: PayloadAction<SubjectAcademicConfigT>) {
      state.subjectAcademicConfigs.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<SubjectAcademicConfigT>) {
      const idx = state.subjectAcademicConfigs.findIndex(
        (config) => config.id === action.payload.id,
      );
      if (idx !== -1) state.subjectAcademicConfigs[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.subjectAcademicConfigs = state.subjectAcademicConfigs.filter(
        (config) => config.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearSubjectAcademicConfigError(state) {
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
  clearSubjectAcademicConfigError,
} = subjectAcademicConfigSlice.actions;

export const selectSubjectAcademicConfigs = (
  state: RootState,
): SubjectAcademicConfigT[] =>
  state.academic.subjectAcademicConfigs.subjectAcademicConfigs;

export const selectSubjectAcademicConfigsStatus = (
  state: RootState,
): RequestStatusT => state.academic.subjectAcademicConfigs.status;

export const selectSubjectAcademicConfigError = (
  state: RootState,
): string | null => state.academic.subjectAcademicConfigs.error;

export const subjectAcademicConfigReducer = subjectAcademicConfigSlice.reducer;

export default subjectAcademicConfigSlice.reducer;
