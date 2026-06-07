import { createAsyncThunk } from "@reduxjs/toolkit";
import { ACADEMIC_LEVEL_THUNKS } from "../../constants";
import { academicLevelApiRepository } from "../../infrastructure/repositories/academic-level-api.repository";
import type { AcademicLevelT } from "../../domain/entities/academic-level.types";

function normalizeThunkError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "No se pudo completar la operacion";
}

export const createAcademicLevel = createAsyncThunk<
  AcademicLevelT,
  { name: string },
  { rejectValue: string }
>(ACADEMIC_LEVEL_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await academicLevelApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
