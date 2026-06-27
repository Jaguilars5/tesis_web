import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { SeverityT } from "./severity.types";

export interface SeverityStateT {
  items: SeverityT[];
  totalCount: number;
  status: RequestStatusT;
  error: string | null;
}

const initialState: SeverityStateT = {
  items: [],
  totalCount: 0,
  status: "idle",
  error: null,
};

const severitySlice = createSlice({
  name: "severities",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<{ items: SeverityT[]; count: number }>) { state.items = action.payload.items; state.totalCount = action.payload.count; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    entityCreated(state, action: PayloadAction<SeverityT>) { state.items.unshift(action.payload); state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<SeverityT>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearSeverityError(state) { state.error = null; },
    setTotalCount(state, action: PayloadAction<number>) { state.totalCount = action.payload; },
  },
});

export const {
  loadPending, loadSuccess, loadError,
  entityCreated, entityUpdated, entityDeleted,
  mutationError, clearSeverityError, setTotalCount,
} = severitySlice.actions;

export const selectItems = (state: RootState): SeverityT[] => state.behavior.severities.items;
export const selectStatus = (state: RootState): RequestStatusT => state.behavior.severities.status;
export const selectError = (state: RootState): string | null => state.behavior.severities.error;
export const selectTotalCount = (state: RootState): number => state.behavior.severities.totalCount;

export const severityReducer = severitySlice.reducer;
export default severitySlice.reducer;
