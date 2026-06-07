import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { QUALITATIVE_SCALES_THUNKS } from "../constants/qualitative-scales.constants";
import { qualitativeScaleApiRepository } from "../infrastructure/repositories/qualitative-scales-api.repository";
import type { QualitativeScaleT } from "../domain/entities/qualitative-scales.types";
import type { QualitativeScaleListParamsT } from "../domain/repositories/qualitative-scales.repository";

export const fetchQualitativeScales = createAsyncThunk<
  QualitativeScaleT[],
  QualitativeScaleListParamsT | undefined,
  { rejectValue: string }
>(QUALITATIVE_SCALES_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await qualitativeScaleApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchQualitativeScale = createAsyncThunk<
  QualitativeScaleT,
  number,
  { rejectValue: string }
>(QUALITATIVE_SCALES_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await qualitativeScaleApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createQualitativeScale = createAsyncThunk<
  QualitativeScaleT,
  Omit<QualitativeScaleT, "id">,
  { rejectValue: string }
>(QUALITATIVE_SCALES_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await qualitativeScaleApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateQualitativeScale = createAsyncThunk<
  QualitativeScaleT,
  Partial<QualitativeScaleT> & { id: number },
  { rejectValue: string }
>(QUALITATIVE_SCALES_THUNKS.UPDATE, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    return await qualitativeScaleApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteQualitativeScale = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(QUALITATIVE_SCALES_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    await qualitativeScaleApiRepository.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
