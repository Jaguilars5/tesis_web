import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { SubjectT } from "./subject.types";

export interface SubjectStateT {
  subjects: SubjectT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: SubjectStateT = {
  subjects: [],
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
    loadSuccess(state, action: PayloadAction<SubjectT[]>) {
      state.subjects = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    subjectCreated(state, action: PayloadAction<SubjectT>) {
      state.subjects.unshift(action.payload);
      state.status = "succeeded";
    },
    subjectUpdated(state, action: PayloadAction<SubjectT>) {
      const idx = state.subjects.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (idx !== -1) state.subjects[idx] = action.payload;
      state.status = "succeeded";
    },
    subjectDeleted(state, action: PayloadAction<number>) {
      state.subjects = state.subjects.filter(
        (p) => p.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearSubjectError(state) {
      state.error = null;
    },
  },
});

export const {
  loadPending,
  loadSuccess,
  loadError,
  subjectCreated,
  subjectUpdated,
  subjectDeleted,
  mutationError,
  clearSubjectError,
} = subjectSlice.actions;

export const selectSubjects = (state: RootState): SubjectT[] =>
  state.academic.subjects.subjects;

export const selectSubjectsStatus = (state: RootState): RequestStatusT =>
  state.academic.subjects.status;

export const selectSubjectError = (state: RootState): string | null =>
  state.academic.subjects.error;

export const subjectsReducer = subjectSlice.reducer;

export default subjectSlice.reducer;
