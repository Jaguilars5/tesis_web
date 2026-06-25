import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { PeriodTypeT } from "./period-types.types";

export interface PeriodTypeStateT {
  periodTypes: PeriodTypeT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: PeriodTypeStateT = {
  periodTypes: [],
  status: "idle",
  error: null,
};

const periodTypeSlice = createSlice({
  name: "periodTypes",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<PeriodTypeT[]>) {
      state.periodTypes = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<PeriodTypeT>) {
      state.periodTypes.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<PeriodTypeT>) {
      const idx = state.periodTypes.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (idx !== -1) state.periodTypes[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.periodTypes = state.periodTypes.filter(
        (p) => p.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearPeriodTypeError(state) {
      state.error = null;
    },
  },
});

export const {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  clearPeriodTypeError,
} = periodTypeSlice.actions;

export const selectPeriodTypes = (state: RootState): PeriodTypeT[] =>
  state.academic.periodTypes.periodTypes;

export const selectPeriodTypesStatus = (state: RootState): RequestStatusT =>
  state.academic.periodTypes.status;

export const selectPeriodTypeError = (state: RootState): string | null =>
  state.academic.periodTypes.error;

export const periodTypeReducer = periodTypeSlice.reducer;

export default periodTypeSlice.reducer;
