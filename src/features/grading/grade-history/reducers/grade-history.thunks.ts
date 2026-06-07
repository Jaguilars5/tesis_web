import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { GRADE_HISTORY_THUNKS } from "../constants/grade-history.constants";
import { gradeHistoryApiRepository } from "../infrastructure/repositories/grade-history-api.repository";
import type { GradeChangeHistoryT } from "../domain/entities/grade-history.types";

export const fetchGradeHistory = createAsyncThunk<
  GradeChangeHistoryT[],
  { page?: number; pageSize?: number } | undefined,
  { rejectValue: string }
>(GRADE_HISTORY_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await gradeHistoryApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchGradeHistoryItem = createAsyncThunk<
  GradeChangeHistoryT,
  number,
  { rejectValue: string }
>(GRADE_HISTORY_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await gradeHistoryApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
