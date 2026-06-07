import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { COMPONENT_INDICATORS_THUNKS } from "../constants/component-indicators.constants";
import { componentIndicatorApiRepository } from "../infrastructure/repositories/component-indicators-api.repository";
import type { ComponentIndicatorT } from "../domain/entities/component-indicators.types";
import type { ComponentIndicatorListParamsT } from "../domain/repositories/component-indicators.repository";

export const fetchComponentIndicators = createAsyncThunk<
  ComponentIndicatorT[],
  ComponentIndicatorListParamsT | undefined,
  { rejectValue: string }
>(COMPONENT_INDICATORS_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await componentIndicatorApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchComponentIndicator = createAsyncThunk<
  ComponentIndicatorT,
  number,
  { rejectValue: string }
>(COMPONENT_INDICATORS_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await componentIndicatorApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createComponentIndicator = createAsyncThunk<
  ComponentIndicatorT,
  Omit<ComponentIndicatorT, "id" | "block_component_name">,
  { rejectValue: string }
>(COMPONENT_INDICATORS_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await componentIndicatorApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateComponentIndicator = createAsyncThunk<
  ComponentIndicatorT,
  Partial<ComponentIndicatorT> & { id: number },
  { rejectValue: string }
>(COMPONENT_INDICATORS_THUNKS.UPDATE, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    return await componentIndicatorApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteComponentIndicator = createAsyncThunk<
  ComponentIndicatorT,
  number,
  { rejectValue: string }
>(COMPONENT_INDICATORS_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await componentIndicatorApiRepository.softDelete(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
