import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { PERIOD_GRADE_SUMMARIES_THUNKS } from "../constants/period-grade-summaries.constants";
import { periodGradeSummaryApiRepository } from "../infrastructure/repositories/period-grade-summaries-api.repository";
import type { PeriodGradeSummaryT } from "../domain/entities/period-grade-summaries.types";
import type { PeriodGradeSummaryListParamsT } from "../domain/repositories/period-grade-summaries.repository";

export const fetchPeriodGradeSummaries = createAsyncThunk<
  PeriodGradeSummaryT[],
  PeriodGradeSummaryListParamsT | undefined,
  { rejectValue: string }
>(PERIOD_GRADE_SUMMARIES_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await periodGradeSummaryApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchPeriodGradeSummary = createAsyncThunk<
  PeriodGradeSummaryT,
  number,
  { rejectValue: string }
>(PERIOD_GRADE_SUMMARIES_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await periodGradeSummaryApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createPeriodGradeSummary = createAsyncThunk<
  PeriodGradeSummaryT,
  Omit<PeriodGradeSummaryT, "id" | "enrollment_name" | "subject_offering_name" | "academic_period_name" | "qualitative_scale_name" | "calculated_at">,
  { rejectValue: string }
>(PERIOD_GRADE_SUMMARIES_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await periodGradeSummaryApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updatePeriodGradeSummary = createAsyncThunk<
  PeriodGradeSummaryT,
  Partial<PeriodGradeSummaryT> & { id: number },
  { rejectValue: string }
>(PERIOD_GRADE_SUMMARIES_THUNKS.UPDATE, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    return await periodGradeSummaryApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deletePeriodGradeSummary = createAsyncThunk<
  PeriodGradeSummaryT,
  number,
  { rejectValue: string }
>(PERIOD_GRADE_SUMMARIES_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await periodGradeSummaryApiRepository.softDelete(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
