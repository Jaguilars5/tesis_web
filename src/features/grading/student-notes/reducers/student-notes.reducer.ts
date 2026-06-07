import { createSlice } from "@reduxjs/toolkit";
import {
  createStudentNote,
  deleteStudentNote,
  fetchStudentNotes,
  updateStudentNote,
} from "./student-notes.thunks";
import type { StudentNotesStateT } from "./student-notes.reducer.types";

const initialState: StudentNotesStateT = {
  studentNotes: [],
  status: "idle",
  error: null,
};

const studentNoteSlice = createSlice({
  name: "studentNotes",
  initialState,
  reducers: {
    clearStudentNoteError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentNotes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStudentNotes.fulfilled, (state, action) => {
        state.studentNotes = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchStudentNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar las notas de estudiantes";
      })
      .addCase(createStudentNote.fulfilled, (state, action) => {
        state.studentNotes.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createStudentNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear la nota de estudiante";
      })
      .addCase(updateStudentNote.fulfilled, (state, action) => {
        const index = state.studentNotes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.studentNotes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateStudentNote.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar la nota de estudiante";
      })
      .addCase(deleteStudentNote.fulfilled, (state, action) => {
        const index = state.studentNotes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.studentNotes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteStudentNote.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar la nota de estudiante";
      });
  },
});

export const { clearStudentNoteError } = studentNoteSlice.actions;
export default studentNoteSlice.reducer;
