import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { GRADE_TYPES_THUNKS } from "../constants/grade-types.constants";
import { gradeTypeApiRepository } from "../infrastructure/repositories/grade-types-api.repository";
import type { GradeTypeT } from "../domain/entities/grade-types.types";
import type { GradeTypeListParamsT } from "../domain/repositories/grade-types.repository";

export const fetchGradeTypes = createAsyncThunk<
  GradeTypeT[],
  GradeTypeListParamsT | undefined,
  { rejectValue: string }
>(GRADE_TYPES_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await gradeTypeApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchGradeType = createAsyncThunk<
  GradeTypeT,
  number,
  { rejectValue: string }
>(GRADE_TYPES_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await gradeTypeApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createGradeType = createAsyncThunk<
  GradeTypeT,
  Omit<GradeTypeT, "id" | "is_active" | "created_at" | "updated_at">,
  { rejectValue: string }
>(GRADE_TYPES_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await gradeTypeApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateGradeType = createAsyncThunk<
  GradeTypeT,
  Partial<GradeTypeT> & { id: number },
  { rejectValue: string }
>(GRADE_TYPES_THUNKS.UPDATE, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    return await gradeTypeApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteGradeType = createAsyncThunk<
  GradeTypeT,
  number,
  { rejectValue: string }
>(GRADE_TYPES_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await gradeTypeApiRepository.softDelete(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
