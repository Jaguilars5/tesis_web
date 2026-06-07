import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { PROMOTION_STATUSES_THUNKS } from "../constants/promotion-statuses.constants";
import { promotionStatusApiRepository } from "../infrastructure/repositories/promotion-statuses-api.repository";
import type { PromotionStatusT } from "../domain/entities/promotion-statuses.types";
import type { PromotionStatusListParamsT } from "../domain/repositories/promotion-statuses.repository";

export const fetchPromotionStatuses = createAsyncThunk<
  PromotionStatusT[],
  PromotionStatusListParamsT | undefined,
  { rejectValue: string }
>(PROMOTION_STATUSES_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await promotionStatusApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchPromotionStatus = createAsyncThunk<
  PromotionStatusT,
  number,
  { rejectValue: string }
>(PROMOTION_STATUSES_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await promotionStatusApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createPromotionStatus = createAsyncThunk<
  PromotionStatusT,
  Omit<PromotionStatusT, "id" | "is_active" | "created_at" | "updated_at">,
  { rejectValue: string }
>(PROMOTION_STATUSES_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await promotionStatusApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updatePromotionStatus = createAsyncThunk<
  PromotionStatusT,
  Partial<PromotionStatusT> & { id: number },
  { rejectValue: string }
>(PROMOTION_STATUSES_THUNKS.UPDATE, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    return await promotionStatusApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deletePromotionStatus = createAsyncThunk<
  PromotionStatusT,
  number,
  { rejectValue: string }
>(PROMOTION_STATUSES_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await promotionStatusApiRepository.softDelete(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
