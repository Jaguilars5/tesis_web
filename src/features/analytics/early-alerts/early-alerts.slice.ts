import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { EarlyAlertT } from "./early-alerts.types";

export interface EarlyAlertStateT {
  items: EarlyAlertT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: EarlyAlertStateT = {
  items: [],
  status: "idle",
  error: null,
};

const earlyAlertSlice = createSlice({
  name: "earlyAlerts",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<EarlyAlertT[]>) { state.items = action.payload; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    entityCreated(state, action: PayloadAction<EarlyAlertT>) { state.items.unshift(action.payload); state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<EarlyAlertT>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearEarlyAlertError(state) { state.error = null; },
  },
});

export const { loadPending, loadSuccess, loadError, entityCreated, entityUpdated, entityDeleted, mutationError, clearEarlyAlertError } = earlyAlertSlice.actions;

export const selectItems = (state: RootState): EarlyAlertT[] => state.analytics.earlyAlerts.items;
export const selectStatus = (state: RootState): RequestStatusT => state.analytics.earlyAlerts.status;
export const selectError = (state: RootState): string | null => state.analytics.earlyAlerts.error;

export const earlyAlertReducer = earlyAlertSlice.reducer;
export default earlyAlertSlice.reducer;
