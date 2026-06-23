import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { ConductIncidentT } from "./conduct-incident.types";

export interface ConductIncidentStateT { conductIncidents: ConductIncidentT[]; currentConductIncident: ConductIncidentT | null; status: RequestStatusT; error: string | null; }
const initialState: ConductIncidentStateT = { conductIncidents: [], currentConductIncident: null, status: "idle", error: null };

const conductIncidentSlice = createSlice({
  name: "conductIncidents", initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<ConductIncidentT[]>) { state.conductIncidents = action.payload; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    currentLoaded(state, action: PayloadAction<ConductIncidentT>) { state.currentConductIncident = action.payload; state.status = "succeeded"; },
    entityCreated(state, action: PayloadAction<ConductIncidentT>) { state.conductIncidents.unshift(action.payload); state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<ConductIncidentT>) {
      const idx = state.conductIncidents.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.conductIncidents[idx] = action.payload;
      if (state.currentConductIncident?.id === action.payload.id) state.currentConductIncident = action.payload;
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearError(state) { state.error = null; },
  },
});

export const { loadPending, loadSuccess, loadError, currentLoaded, entityCreated, entityUpdated, mutationError, clearError } = conductIncidentSlice.actions;
export const selectConductIncidents = (state: RootState): ConductIncidentT[] => state.behavior.conductIncidents.conductIncidents;
export const selectConductIncidentsStatus = (state: RootState): RequestStatusT => state.behavior.conductIncidents.status;
export const selectConductIncidentsError = (state: RootState): string | null => state.behavior.conductIncidents.error;
export const selectCurrentConductIncident = (state: RootState): ConductIncidentT | null => state.behavior.conductIncidents.currentConductIncident;
export const conductIncidentReducer = conductIncidentSlice.reducer;
export default conductIncidentSlice.reducer;
