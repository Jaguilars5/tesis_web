import { createSlice } from "@reduxjs/toolkit";

import {
  createTeacherSubjectSection,
  deleteTeacherSubjectSection,
  fetchTeacherSubjectSections,
  updateTeacherSubjectSection,
} from "./teacher-subject-section.thunks";

import type { TeacherSubjectSectionT } from "../domain/teacher-subject-section.entity";

interface TeacherSubjectSectionStateT {
  teacherSubjectSections: TeacherSubjectSectionT[];
  status: "idle" | "loading" | "succeeded" | "failed";
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
    clearTeacherSubjectSectionError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherSubjectSections.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTeacherSubjectSections.fulfilled, (state, action) => {
        state.teacherSubjectSections = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchTeacherSubjectSections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudieron cargar las asignaciones docente-materia";
      })
      .addCase(createTeacherSubjectSection.fulfilled, (state, action) => {
        state.teacherSubjectSections.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createTeacherSubjectSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear la asignacion docente-materia";
      })
      .addCase(updateTeacherSubjectSection.fulfilled, (state, action) => {
        const index = state.teacherSubjectSections.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.teacherSubjectSections[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateTeacherSubjectSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo actualizar la asignacion docente-materia";
      })
      .addCase(deleteTeacherSubjectSection.fulfilled, (state, action) => {
        const index = state.teacherSubjectSections.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.teacherSubjectSections[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteTeacherSubjectSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo eliminar la asignacion docente-materia";
      });
  },
});

export const { clearTeacherSubjectSectionError } = teacherSubjectSectionSlice.actions;
export default teacherSubjectSectionSlice.reducer;
