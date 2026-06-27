import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { SubjectT } from "./subject.types";

export interface SubjectStateT {
  subjects: SubjectT[];
  totalCount: number;
  status: RequestStatusT;
  error: string | null;
}

const initialState: SubjectStateT = {
  subjects: [],
  totalCount: 0,
  status: "idle",
  error: null,
};

const subjectSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<{ items: SubjectT[]; count: number }>) {
      state.subjects = action.payload.items;
      state.totalCount = action.payload.count;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<SubjectT>) {
      state.subjects.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<SubjectT>) {
      const idx = state.subjects.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.subjects[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.subjects = state.subjects.filter((p) => p.id !== action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearSubjectError(state) {
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
  clearSubjectError,
  setTotalCount,
} = subjectSlice.actions;

export const selectSubjects = (state: RootState): SubjectT[] =>
  state.academic.subjects.subjects;

export const selectSubjectsStatus = (state: RootState): RequestStatusT =>
  state.academic.subjects.status;

export const selectSubjectError = (state: RootState): string | null =>
  state.academic.subjects.error;

export const selectSubjectTotalCount = (state: RootState): number =>
  state.academic.subjects.totalCount;

export const subjectsReducer = subjectSlice.reducer;

export default subjectSlice.reducer;
