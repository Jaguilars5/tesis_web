import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { StudentNoteT } from "./student-notes.types";

export interface StudentNotesStateT {
  studentNotes: StudentNoteT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: StudentNotesStateT = {
  studentNotes: [],
  status: "idle",
  error: null,
};

const studentNotesSlice = createSlice({
  name: "studentNotes",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<StudentNoteT[]>) {
      state.studentNotes = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<StudentNoteT>) {
      state.studentNotes.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<StudentNoteT>) {
      const index = state.studentNotes.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) state.studentNotes[index] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.studentNotes = state.studentNotes.filter(
        (item) => item.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearStudentNotesError(state) {
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
  clearStudentNotesError,
} = studentNotesSlice.actions;

export const selectStudentNotes = (state: RootState): StudentNoteT[] =>
  state.grading.studentNotes.studentNotes;

export const selectStudentNotesStatus = (state: RootState): RequestStatusT =>
  state.grading.studentNotes.status;

export const selectStudentNotesError = (state: RootState): string | null =>
  state.grading.studentNotes.error;

export const studentNotesReducer = studentNotesSlice.reducer;
export default studentNotesSlice.reducer;
