import type { RootState } from "@shared/redux/store";
import type { StudentNoteT } from "../domain/entities/student-notes.types";

export const selectStudentNotes = (state: RootState): StudentNoteT[] =>
  state.grading.studentNotes.studentNotes;

export const selectStudentNotesStatus = (state: RootState) =>
  state.grading.studentNotes.status;

export const selectStudentNotesError = (state: RootState) =>
  state.grading.studentNotes.error;
