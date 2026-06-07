import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { STUDENT_NOTES_THUNKS } from "../constants/student-notes.constants";
import { studentNoteApiRepository } from "../infrastructure/repositories/student-notes-api.repository";
import type { StudentNoteT } from "../domain/entities/student-notes.types";
import type { StudentNoteListParamsT } from "../domain/repositories/student-notes.repository";

export const fetchStudentNotes = createAsyncThunk<
  StudentNoteT[],
  StudentNoteListParamsT | undefined,
  { rejectValue: string }
>(STUDENT_NOTES_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await studentNoteApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchStudentNote = createAsyncThunk<
  StudentNoteT,
  number,
  { rejectValue: string }
>(STUDENT_NOTES_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await studentNoteApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createStudentNote = createAsyncThunk<
  StudentNoteT,
  Parameters<typeof studentNoteApiRepository.create>[0],
  { rejectValue: string }
>(STUDENT_NOTES_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await studentNoteApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateStudentNote = createAsyncThunk<
  StudentNoteT,
  Partial<StudentNoteT> & { id: number },
  { rejectValue: string }
>(STUDENT_NOTES_THUNKS.UPDATE, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    return await studentNoteApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteStudentNote = createAsyncThunk<
  StudentNoteT,
  number,
  { rejectValue: string }
>(STUDENT_NOTES_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await studentNoteApiRepository.softDelete(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
