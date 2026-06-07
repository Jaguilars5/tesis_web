import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { RECOVERY_PROCESSES_THUNKS } from "../constants/recovery-processes.constants";
import { recoveryProcessApiRepository } from "../infrastructure/repositories/recovery-processes-api.repository";
import type { RecoveryProcessT } from "../domain/entities/recovery-processes.types";
import type { RecoveryProcessListParamsT } from "../domain/repositories/recovery-processes.repository";

export const fetchRecoveryProcesses = createAsyncThunk<
  RecoveryProcessT[],
  RecoveryProcessListParamsT | undefined,
  { rejectValue: string }
>(RECOVERY_PROCESSES_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await recoveryProcessApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchRecoveryProcess = createAsyncThunk<
  RecoveryProcessT,
  number,
  { rejectValue: string }
>(RECOVERY_PROCESSES_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await recoveryProcessApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createRecoveryProcess = createAsyncThunk<
  RecoveryProcessT,
  Omit<RecoveryProcessT, "id" | "period_grade_summary_name" | "managed_by_user_name">,
  { rejectValue: string }
>(RECOVERY_PROCESSES_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await recoveryProcessApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateRecoveryProcess = createAsyncThunk<
  RecoveryProcessT,
  Partial<RecoveryProcessT> & { id: number },
  { rejectValue: string }
>(RECOVERY_PROCESSES_THUNKS.UPDATE, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    return await recoveryProcessApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteRecoveryProcess = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(RECOVERY_PROCESSES_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    await recoveryProcessApiRepository.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
