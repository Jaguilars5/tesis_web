import { createAsyncThunk } from "@reduxjs/toolkit";
import { SUBJECT_THUNKS } from "../../constants/subject.constants";
import { subjectApiRepository } from "../../infrastructure/repositories/subject-api.repository";
import type { SubjectListParamsT } from "../../domain/repositories/subject.repository";
import type { SubjectT } from "../../domain/entities/subject.types";

function normalizeThunkError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "No se pudo completar la operacion";
}

export const fetchSubjects = createAsyncThunk<
  SubjectT[],
  SubjectListParamsT | undefined,
  { rejectValue: string }
>(SUBJECT_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await subjectApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
