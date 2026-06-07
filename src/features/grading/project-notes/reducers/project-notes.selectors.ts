import type { RootState } from "@shared/redux/store";
import type { ProjectNoteT } from "../domain/entities/project-notes.types";

export const selectProjectNotes = (state: RootState): ProjectNoteT[] =>
  state.grading.projectNotes.projectNotes;

export const selectProjectNotesStatus = (state: RootState) =>
  state.grading.projectNotes.status;

export const selectProjectNotesError = (state: RootState) =>
  state.grading.projectNotes.error;
