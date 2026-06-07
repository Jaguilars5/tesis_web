import { createAsyncThunk } from "@reduxjs/toolkit";
import { SUBJECT_THUNKS } from "../../constants/subject.constants";
import { subjectApiRepository } from "../../infrastructure/repositories/subject-api.repository";
import type { SubjectT } from "../../domain/entities/subject.types";

function normalizeThunkError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "No se pudo completar la operacion";
}

export const fetchSubject = createAsyncThunk<
  SubjectT,
  number,
  { rejectValue: string }
>(SUBJECT_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await subjectApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
