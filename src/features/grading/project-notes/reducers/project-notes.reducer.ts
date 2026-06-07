import { createSlice } from "@reduxjs/toolkit";
import {
  createProjectNote,
  deleteProjectNote,
  fetchProjectNotes,
  updateProjectNote,
} from "./project-notes.thunks";
import type { ProjectNotesStateT } from "./project-notes.reducer.types";

const initialState: ProjectNotesStateT = {
  projectNotes: [],
  status: "idle",
  error: null,
};

const projectNoteSlice = createSlice({
  name: "projectNotes",
  initialState,
  reducers: {
    clearProjectNoteError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectNotes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjectNotes.fulfilled, (state, action) => {
        state.projectNotes = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchProjectNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudieron cargar las notas de proyectos interdisciplinarios";
      })
      .addCase(createProjectNote.fulfilled, (state, action) => {
        state.projectNotes.unshift(action.payload);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createProjectNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "No se pudo crear la nota de proyecto interdisciplinario";
      })
      .addCase(updateProjectNote.fulfilled, (state, action) => {
        const index = state.projectNotes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.projectNotes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateProjectNote.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo actualizar la nota de proyecto interdisciplinario";
      })
      .addCase(deleteProjectNote.fulfilled, (state, action) => {
        const index = state.projectNotes.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.projectNotes[index] = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteProjectNote.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "No se pudo eliminar la nota de proyecto interdisciplinario";
      });
  },
});

export const { clearProjectNoteError } = projectNoteSlice.actions;
export default projectNoteSlice.reducer;
