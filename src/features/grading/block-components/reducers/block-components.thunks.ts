import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeThunkError } from "@shared/utils/normalizeThunkError";
import { BLOCK_COMPONENTS_THUNKS } from "../constants/block-components.constants";
import { blockComponentApiRepository } from "../infrastructure/repositories/block-components-api.repository";
import type { BlockComponentT } from "../domain/entities/block-components.types";
import type { BlockComponentListParamsT } from "../domain/repositories/block-components.repository";

export const fetchBlockComponents = createAsyncThunk<
  BlockComponentT[],
  BlockComponentListParamsT | undefined,
  { rejectValue: string }
>(BLOCK_COMPONENTS_THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await blockComponentApiRepository.list(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const fetchBlockComponent = createAsyncThunk<
  BlockComponentT,
  number,
  { rejectValue: string }
>(BLOCK_COMPONENTS_THUNKS.GET, async (id, { rejectWithValue }) => {
  try {
    return await blockComponentApiRepository.get(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const createBlockComponent = createAsyncThunk<
  BlockComponentT,
  Omit<BlockComponentT, "id" | "evaluation_block_name">,
  { rejectValue: string }
>(BLOCK_COMPONENTS_THUNKS.CREATE, async (payload, { rejectWithValue }) => {
  try {
    return await blockComponentApiRepository.create(payload);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateBlockComponent = createAsyncThunk<
  BlockComponentT,
  Partial<BlockComponentT> & { id: number },
  { rejectValue: string }
>(BLOCK_COMPONENTS_THUNKS.UPDATE, async ({ id, ...data }, { rejectWithValue }) => {
  try {
    return await blockComponentApiRepository.update(id, data);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const deleteBlockComponent = createAsyncThunk<
  BlockComponentT,
  number,
  { rejectValue: string }
>(BLOCK_COMPONENTS_THUNKS.DELETE, async (id, { rejectWithValue }) => {
  try {
    return await blockComponentApiRepository.softDelete(id);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});
