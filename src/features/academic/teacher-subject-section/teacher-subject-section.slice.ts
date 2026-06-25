import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { TeacherSubjectSectionT } from "./teacher-subject-section.types";

export interface TeacherSubjectSectionStateT {
  teacherSubjectSections: TeacherSubjectSectionT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: TeacherSubjectSectionStateT = {
  teacherSubjectSections: [],
  status: "idle",
  error: null,
};

const teacherSubjectSectionSlice = createSlice({
  name: "teacherSubjectSections",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<TeacherSubjectSectionT[]>) {
      state.teacherSubjectSections = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<TeacherSubjectSectionT>) {
      state.teacherSubjectSections.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<TeacherSubjectSectionT>) {
      const idx = state.teacherSubjectSections.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (idx !== -1) state.teacherSubjectSections[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.teacherSubjectSections = state.teacherSubjectSections.filter(
        (p) => p.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearTeacherSubjectSectionError(state) {
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
  clearTeacherSubjectSectionError,
} = teacherSubjectSectionSlice.actions;

export const selectTeacherSubjectSections = (state: RootState): TeacherSubjectSectionT[] =>
  state.academic.teacherSubjectSections.teacherSubjectSections;

export const selectTeacherSubjectSectionsStatus = (state: RootState): RequestStatusT =>
  state.academic.teacherSubjectSections.status;

export const selectTeacherSubjectSectionError = (state: RootState): string | null =>
  state.academic.teacherSubjectSections.error;

export const teacherSubjectSectionReducer = teacherSubjectSectionSlice.reducer;

export default teacherSubjectSectionSlice.reducer;
