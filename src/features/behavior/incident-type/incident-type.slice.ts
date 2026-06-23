import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { IncidentTypeT } from "./incident-type.types";
export interface IncidentTypeStateT { incidentTypes: IncidentTypeT[]; status: RequestStatusT; error: string | null; }
const initialState: IncidentTypeStateT = { incidentTypes: [], status: "idle", error: null };
const slice = createSlice({
  name: "incidentTypes", initialState,
  reducers: {
    loadPending(s) { s.status = "loading"; s.error = null; },
    loadSuccess(s, a: PayloadAction<IncidentTypeT[]>) { s.incidentTypes = a.payload; s.status = "succeeded"; },
    loadError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; },
    entityCreated(s, a: PayloadAction<IncidentTypeT>) { s.incidentTypes.unshift(a.payload); s.status = "succeeded"; },
    entityUpdated(s, a: PayloadAction<IncidentTypeT>) { const idx = s.incidentTypes.findIndex((p) => p.id === a.payload.id); if (idx !== -1) s.incidentTypes[idx] = a.payload; s.status = "succeeded"; },
    entityDeleted(s, a: PayloadAction<number>) { s.incidentTypes = s.incidentTypes.filter((p) => p.id !== a.payload); s.status = "succeeded"; },
    mutationError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; },
    clearError(s) { s.error = null; },
  },
});
export const { loadPending, loadSuccess, loadError, entityCreated, entityUpdated, entityDeleted, mutationError, clearError } = slice.actions;
export const selectIncidentTypes = (s: RootState): IncidentTypeT[] => s.behavior.incidentTypes.incidentTypes;
export const selectIncidentTypesStatus = (s: RootState): RequestStatusT => s.behavior.incidentTypes.status;
export const selectIncidentTypesError = (s: RootState): string | null => s.behavior.incidentTypes.error;
export const incidentTypeReducer = slice.reducer;
export default slice.reducer;
