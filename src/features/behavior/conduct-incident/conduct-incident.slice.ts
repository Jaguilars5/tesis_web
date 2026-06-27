import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { ConductIncidentT } from "./conduct-incident.types";

export interface ConductIncidentStateT {
  items: ConductIncidentT[];
  totalCount: number;
  currentConductIncident: ConductIncidentT | null;
  status: RequestStatusT;
  error: string | null;
}

const initialState: ConductIncidentStateT = {
  items: [],
  totalCount: 0,
  currentConductIncident: null,
  status: "idle",
  error: null,
};

const conductIncidentSlice = createSlice({
  name: "conductIncidents",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(
      state,
      action: PayloadAction<{ items: ConductIncidentT[]; count: number }>,
    ) {
      state.items = action.payload.items;
      state.totalCount = action.payload.count;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    currentLoaded(state, action: PayloadAction<ConductIncidentT>) {
      state.currentConductIncident = action.payload;
      state.status = "succeeded";
    },
    entityCreated(state, action: PayloadAction<ConductIncidentT>) {
      state.items.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<ConductIncidentT>) {
      const idx = state.items.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      if (state.currentConductIncident?.id === action.payload.id)
        state.currentConductIncident = action.payload;
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    setTotalCount(state, action: PayloadAction<number>) {
      state.totalCount = action.payload;
    },
    clearConductIncidentError(state) {
      state.error = null;
    },
  },
});

export const {
  loadPending,
  loadSuccess,
  loadError,
  currentLoaded,
  entityCreated,
  entityUpdated,
  mutationError,
  setTotalCount,
  clearConductIncidentError,
} = conductIncidentSlice.actions;

export const selectItems = (state: RootState): ConductIncidentT[] =>
  state.behavior.conductIncidents.items;
export const selectTotalCount = (state: RootState): number =>
  state.behavior.conductIncidents.totalCount;
export const selectStatus = (state: RootState): RequestStatusT =>
  state.behavior.conductIncidents.status;
export const selectError = (state: RootState): string | null =>
  state.behavior.conductIncidents.error;
export const selectCurrentConductIncident = (
  state: RootState,
): ConductIncidentT | null =>
  state.behavior.conductIncidents.currentConductIncident;

export const conductIncidentReducer = conductIncidentSlice.reducer;
export default conductIncidentSlice.reducer;
