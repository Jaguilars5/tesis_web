import { createAsyncThunk } from "@reduxjs/toolkit";
import { ACADEMIC_LEVEL_THUNKS } from "../../constants";
import { academicLevelApiRepository } from "../../infrastructure/repositories/academic-level-api.repository";
import type { AcademicLevelT } from "../../domain/entities/academic-level.types";

function normalizeThunkError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "No se pudo completar la operacion";
}

export const updateAcademicLevel = createAsyncThunk<
  AcademicLevelT,
  { id: number; name?: string; is_active?: boolean },
  { rejectValue: string }
>(ACADEMIC_LEVEL_THUNKS.UPDATE, async (payload, { rejectWithValue }) => {
  try {
    const { id, ...data } = payload;
    return await academicLevelApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
