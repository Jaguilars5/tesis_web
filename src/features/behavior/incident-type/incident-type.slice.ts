import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { IncidentTypeT } from "./incident-type.types";

export interface IncidentTypeStateT {
  items: IncidentTypeT[];
  totalCount: number;
  status: RequestStatusT;
  error: string | null;
}

const initialState: IncidentTypeStateT = {
  items: [],
  totalCount: 0,
  status: "idle",
  error: null,
};

const incidentTypeSlice = createSlice({
  name: "incidentTypes",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<{ items: IncidentTypeT[]; count: number }>) { state.items = action.payload.items; state.totalCount = action.payload.count; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    entityCreated(state, action: PayloadAction<IncidentTypeT>) { state.items.unshift(action.payload); state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<IncidentTypeT>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    setTotalCount(state, action: PayloadAction<number>) { state.totalCount = action.payload; },
    clearIncidentTypeError(state) { state.error = null; },
  },
});

export const {
  loadPending, loadSuccess, loadError,
  entityCreated, entityUpdated, entityDeleted,
  mutationError, setTotalCount, clearIncidentTypeError,
} = incidentTypeSlice.actions;

export const selectItems = (state: RootState): IncidentTypeT[] => state.behavior.incidentTypes.items;
export const selectTotalCount = (state: RootState): number => state.behavior.incidentTypes.totalCount;
export const selectStatus = (state: RootState): RequestStatusT => state.behavior.incidentTypes.status;
export const selectError = (state: RootState): string | null => state.behavior.incidentTypes.error;

export const incidentTypeReducer = incidentTypeSlice.reducer;
export default incidentTypeSlice.reducer;
