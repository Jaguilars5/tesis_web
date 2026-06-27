import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { SubjectAcademicConfigT } from "./subject-academic-config.types";

export interface SubjectAcademicConfigStateT {
  subjectAcademicConfigs: SubjectAcademicConfigT[];
  totalCount: number;
  status: RequestStatusT;
  error: string | null;
}

const initialState: SubjectAcademicConfigStateT = {
  subjectAcademicConfigs: [],
  totalCount: 0,
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
    loadSuccess(state, action: PayloadAction<{ items: SubjectAcademicConfigT[]; count: number }>) {
      state.subjectAcademicConfigs = action.payload.items;
      state.totalCount = action.payload.count;
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
    setTotalCount(state, action: PayloadAction<number>) {
      state.totalCount = action.payload;
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
  setTotalCount,
} = subjectAcademicConfigSlice.actions;

export const selectSubjectAcademicConfigs = (
  state: RootState,
): SubjectAcademicConfigT[] =>
  state.academic.subjectAcademicConfigs.subjectAcademicConfigs;

export const selectSubjectAcademicConfigsStatus = (
  state: RootState,
): RequestStatusT => state.academic.subjectAcademicConfigs.status;

export const selectSubjectAcademicConfigTotalCount = (state: RootState): number => state.academic.subjectAcademicConfigs.totalCount;

export const selectSubjectAcademicConfigError = (
  state: RootState,
): string | null => state.academic.subjectAcademicConfigs.error;

export const subjectAcademicConfigReducer = subjectAcademicConfigSlice.reducer;

export default subjectAcademicConfigSlice.reducer;
