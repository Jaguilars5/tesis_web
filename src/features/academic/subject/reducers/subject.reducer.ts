import { createSlice } from "@reduxjs/toolkit";
import {
  createSubject,
  deleteSubject,
  fetchSubjects,
  updateSubject,
} from "../application/use-cases";
import type { SubjectStateT } from "./subject.reducer.types";

const initialState: SubjectStateT = {
  subjects: [],
  status: "idle",
  error: null,
};

const subjectSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    clearSubjectError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.subjects = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar las materias";
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.subjects.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear la materia";
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        const index = state.subjects.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar la materia";
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        const index = state.subjects.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar la materia";
      });
  },
});

export const { clearSubjectError } = subjectSlice.actions;
export default subjectSlice.reducer;
