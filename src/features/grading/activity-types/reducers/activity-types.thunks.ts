import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { ACTIVITY_TYPES_THUNKS } from "../constants/activity-types.constants";
import { activityTypeApiRepository } from "../infrastructure/repositories/activity-types-api.repository";
import type { ActivityTypeT } from "../domain/entities/activity-types.types";
import type { ActivityTypeListParamsT } from "../domain/repositories/activity-types.repository";

export const fetchActivityTypes = createAsyncThunk<
  ActivityTypeT[],
  ActivityTypeListParamsT | undefined,
  { rejectValue: string }
>(ACTIVITY_TYPES_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await activityTypeApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchActivityType = createAsyncThunk<
  ActivityTypeT,
  number,
  { rejectValue: string }
>(ACTIVITY_TYPES_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await activityTypeApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createActivityType = createAsyncThunk<
  ActivityTypeT,
  Omit<ActivityTypeT, "id" | "is_active" | "created_at" | "updated_at">,
  { rejectValue: string }
>(ACTIVITY_TYPES_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await activityTypeApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateActivityType = createAsyncThunk<
  ActivityTypeT,
  Partial<ActivityTypeT> & { id: number },
  { rejectValue: string }
>(ACTIVITY_TYPES_THUNKS.UPDATE, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    return await activityTypeApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteActivityType = createAsyncThunk<
  ActivityTypeT,
  number,
  { rejectValue: string }
>(ACTIVITY_TYPES_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await activityTypeApiRepository.softDelete(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
