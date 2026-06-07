import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { RECOVERY_PROCESS_TYPES_THUNKS } from "../constants/recovery-process-types.constants";
import { recoveryProcessTypeApiRepository } from "../infrastructure/repositories/recovery-process-types-api.repository";
import type { RecoveryProcessTypeT } from "../domain/entities/recovery-process-types.types";
import type { RecoveryProcessTypeListParamsT } from "../domain/repositories/recovery-process-types.repository";

export const fetchRecoveryProcessTypes = createAsyncThunk<
  RecoveryProcessTypeT[],
  RecoveryProcessTypeListParamsT | undefined,
  { rejectValue: string }
>(RECOVERY_PROCESS_TYPES_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await recoveryProcessTypeApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchRecoveryProcessType = createAsyncThunk<
  RecoveryProcessTypeT,
  number,
  { rejectValue: string }
>(RECOVERY_PROCESS_TYPES_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await recoveryProcessTypeApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createRecoveryProcessType = createAsyncThunk<
  RecoveryProcessTypeT,
  Omit<RecoveryProcessTypeT, "id" | "is_active" | "created_at" | "updated_at">,
  { rejectValue: string }
>(RECOVERY_PROCESS_TYPES_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await recoveryProcessTypeApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateRecoveryProcessType = createAsyncThunk<
  RecoveryProcessTypeT,
  Partial<RecoveryProcessTypeT> & { id: number },
  { rejectValue: string }
>(RECOVERY_PROCESS_TYPES_THUNKS.UPDATE, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    return await recoveryProcessTypeApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteRecoveryProcessType = createAsyncThunk<
  RecoveryProcessTypeT,
  number,
  { rejectValue: string }
>(RECOVERY_PROCESS_TYPES_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await recoveryProcessTypeApiRepository.softDelete(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
