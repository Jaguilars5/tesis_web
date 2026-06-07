import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { EVALUATION_TYPES_THUNKS } from "../constants/evaluation-types.constants";
import { evaluationTypeApiRepository } from "../infrastructure/repositories/evaluation-types-api.repository";
import type { EvaluationTypeT } from "../domain/entities/evaluation-types.types";
import type { EvaluationTypeListParamsT } from "../domain/repositories/evaluation-types.repository";

export const fetchEvaluationTypes = createAsyncThunk<
  EvaluationTypeT[],
  EvaluationTypeListParamsT | undefined,
  { rejectValue: string }
>(EVALUATION_TYPES_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await evaluationTypeApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchEvaluationType = createAsyncThunk<
  EvaluationTypeT,
  number,
  { rejectValue: string }
>(EVALUATION_TYPES_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await evaluationTypeApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createEvaluationType = createAsyncThunk<
  EvaluationTypeT,
  Omit<EvaluationTypeT, "id" | "is_active" | "created_at" | "updated_at">,
  { rejectValue: string }
>(EVALUATION_TYPES_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await evaluationTypeApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateEvaluationType = createAsyncThunk<
  EvaluationTypeT,
  Partial<EvaluationTypeT> & { id: number },
  { rejectValue: string }
>(EVALUATION_TYPES_THUNKS.UPDATE, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    return await evaluationTypeApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteEvaluationType = createAsyncThunk<
  EvaluationTypeT,
  number,
  { rejectValue: string }
>(EVALUATION_TYPES_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await evaluationTypeApiRepository.softDelete(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
