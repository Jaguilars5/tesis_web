import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { PERIOD_TYPE_THUNKS } from "../constants/period-types.constants";
import { periodTypeApiRepository } from "../infrastructure/repositories/period-types-api.repository";
import type { PeriodTypeT } from "../domain/entities/period-types.types";
import type { PeriodTypeListParamsT } from "../domain/repositories/period-types.repository";

export const fetchPeriodTypes = createAsyncThunk<
  PeriodTypeT[],
  PeriodTypeListParamsT | undefined,
  { rejectValue: string }
>(PERIOD_TYPE_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await periodTypeApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchPeriodType = createAsyncThunk<
  PeriodTypeT,
  number,
  { rejectValue: string }
>(PERIOD_TYPE_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await periodTypeApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createPeriodType = createAsyncThunk<
  PeriodTypeT,
  Omit<PeriodTypeT, "id" | "is_active">,
  { rejectValue: string }
>(PERIOD_TYPE_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await periodTypeApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updatePeriodType = createAsyncThunk<
  PeriodTypeT,
  Partial<PeriodTypeT> & { id: number },
  { rejectValue: string }
>(PERIOD_TYPE_THUNKS.UPDATE, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    return await periodTypeApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deletePeriodType = createAsyncThunk<
  PeriodTypeT,
  number,
  { rejectValue: string }
>(PERIOD_TYPE_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await periodTypeApiRepository.softDelete(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
